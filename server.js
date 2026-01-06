const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for webhook endpoint
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: 'Too many webhook requests, please slow down.',
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);
app.use('/api/webhook/', webhookLimiter);

// Initialize Database
const db = new Database('chatbot.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS flows (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT,
    trigger_keyword TEXT,
    nodes TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT UNIQUE,
    email TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_interaction DATETIME
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    contact_id TEXT,
    flow_id TEXT,
    direction TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id TEXT PRIMARY KEY,
    flow_id TEXT,
    contact_id TEXT,
    event_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flow_id) REFERENCES flows(id),
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
  );
`);

// ==================== FLOWS API ====================

// Get all flows
app.get('/api/flows', (req, res) => {
  try {
    const flows = db.prepare('SELECT * FROM flows ORDER BY created_at DESC').all();
    flows.forEach(flow => {
      if (flow.nodes) {
        flow.nodes = JSON.parse(flow.nodes);
      }
    });
    res.json(flows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single flow
app.get('/api/flows/:id', (req, res) => {
  try {
    const flow = db.prepare('SELECT * FROM flows WHERE id = ?').get(req.params.id);
    if (flow && flow.nodes) {
      flow.nodes = JSON.parse(flow.nodes);
    }
    res.json(flow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create flow
app.post('/api/flows', (req, res) => {
  try {
    const { name, description, trigger_type, trigger_keyword, nodes } = req.body;
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO flows (id, name, description, trigger_type, trigger_keyword, nodes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name, description, trigger_type, trigger_keyword, JSON.stringify(nodes || []));
    
    res.json({ id, message: 'Flow created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update flow
app.put('/api/flows/:id', (req, res) => {
  try {
    const { name, description, trigger_type, trigger_keyword, nodes, active } = req.body;
    
    const stmt = db.prepare(`
      UPDATE flows 
      SET name = ?, description = ?, trigger_type = ?, trigger_keyword = ?, 
          nodes = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      name, 
      description, 
      trigger_type, 
      trigger_keyword, 
      JSON.stringify(nodes || []),
      active !== undefined ? active : 1,
      req.params.id
    );
    
    res.json({ message: 'Flow updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete flow
app.delete('/api/flows/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM flows WHERE id = ?').run(req.params.id);
    res.json({ message: 'Flow deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONTACTS API ====================

// Get all contacts
app.get('/api/contacts', (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY last_interaction DESC').all();
    contacts.forEach(contact => {
      if (contact.tags) {
        contact.tags = JSON.parse(contact.tags);
      }
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contact
app.post('/api/contacts', (req, res) => {
  try {
    const { name, phone, email, tags } = req.body;
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO contacts (id, name, phone, email, tags, last_interaction)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    stmt.run(id, name, phone, email, JSON.stringify(tags || []));
    
    res.json({ id, message: 'Contact created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MESSAGES API ====================

// Get messages for a contact
app.get('/api/messages/:contactId', (req, res) => {
  try {
    const messages = db.prepare(
      'SELECT * FROM messages WHERE contact_id = ? ORDER BY created_at ASC'
    ).all(req.params.contactId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message (simulate)
app.post('/api/messages', (req, res) => {
  try {
    const { contact_id, flow_id, direction, content } = req.body;
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO messages (id, contact_id, flow_id, direction, content)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, contact_id, flow_id, direction, content);
    
    // Update contact last interaction
    db.prepare('UPDATE contacts SET last_interaction = CURRENT_TIMESTAMP WHERE id = ?')
      .run(contact_id);
    
    res.json({ id, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process incoming message (webhook simulation)
app.post('/api/webhook/message', (req, res) => {
  try {
    const { phone, message } = req.body;
    
    // Find or create contact
    let contact = db.prepare('SELECT * FROM contacts WHERE phone = ?').get(phone);
    
    if (!contact) {
      const contactId = uuidv4();
      db.prepare(`
        INSERT INTO contacts (id, phone, last_interaction)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `).run(contactId, phone);
      contact = { id: contactId, phone };
    }
    
    // Save incoming message
    const messageId = uuidv4();
    db.prepare(`
      INSERT INTO messages (id, contact_id, direction, content)
      VALUES (?, ?, 'incoming', ?)
    `).run(messageId, contact.id, message);
    
    // Find matching flow
    const flows = db.prepare(
      'SELECT * FROM flows WHERE active = 1 AND trigger_type = "keyword"'
    ).all();
    
    let response = null;
    
    for (const flow of flows) {
      const keyword = flow.trigger_keyword?.toLowerCase();
      if (keyword && message.toLowerCase().includes(keyword)) {
        const nodes = JSON.parse(flow.nodes || '[]');
        
        // Find start node and get first message
        const startNode = nodes.find(n => n.type === 'start');
        if (startNode && startNode.nextNode) {
          const messageNode = nodes.find(n => n.id === startNode.nextNode);
          if (messageNode && messageNode.content) {
            response = messageNode.content;
            
            // Save automated response
            const responseId = uuidv4();
            db.prepare(`
              INSERT INTO messages (id, contact_id, flow_id, direction, content)
              VALUES (?, ?, ?, 'outgoing', ?)
            `).run(responseId, contact.id, flow.id, response);
            
            // Track analytics
            db.prepare(`
              INSERT INTO analytics (id, flow_id, contact_id, event_type)
              VALUES (?, ?, ?, 'flow_triggered')
            `).run(uuidv4(), flow.id, contact.id);
          }
        }
        break;
      }
    }
    
    res.json({ 
      success: true, 
      response: response || 'Obrigado pela mensagem! Em breve entraremos em contato.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS API ====================

// Get analytics overview
app.get('/api/analytics', (req, res) => {
  try {
    const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get();
    const totalFlows = db.prepare('SELECT COUNT(*) as count FROM flows').get();
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get();
    const activeFlows = db.prepare('SELECT COUNT(*) as count FROM flows WHERE active = 1').get();
    
    // Recent activity
    const recentMessages = db.prepare(`
      SELECT m.*, c.name, c.phone 
      FROM messages m
      LEFT JOIN contacts c ON m.contact_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 10
    `).all();
    
    res.json({
      totalContacts: totalContacts.count,
      totalFlows: totalFlows.count,
      totalMessages: totalMessages.count,
      activeFlows: activeFlows.count,
      recentMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Chat Automation Server running on port ${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`🏠 Store Front: http://localhost:${PORT}/index.html`);
});

module.exports = app;
