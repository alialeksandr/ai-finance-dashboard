# AI SMB CFO Dashboard

Single-page finance dashboard that pulls invoice data from an n8n webhook and displays interactive charts (ECharts) and a data table.

## Stack

- **Backend:** Node.js + Express (port 3000)
- **Frontend:** Vanilla JS + CSS, Apache ECharts (CDN)
- **Process manager:** PM2
- **Reverse proxy:** nginx

## Quick Start (local)

```bash
git clone https://github.com/alialeksandr/ai-finance-dashboard.git
cd ai-finance-dashboard
npm install
cp .env.example .env
# Edit .env and set your N8N_WEBHOOK_URL
node server.js
# Open http://localhost:3000
```

## Deploy on Ubuntu VPS

### 1. Install prerequisites

```bash
sudo apt update && sudo apt install -y nodejs npm nginx
sudo npm install -g pm2
```

### 2. Clone and install

```bash
cd /var/www
sudo git clone https://github.com/alialeksandr/ai-finance-dashboard.git
cd ai-finance-dashboard
sudo npm install --production
```

### 3. Configure environment

```bash
sudo cp .env.example .env
sudo nano .env
# Set: N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
```

### 4. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed command to enable on boot
```

### 5. Configure nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/recon-dashboard
sudo ln -s /etc/nginx/sites-available/recon-dashboard /etc/nginx/sites-enabled/
sudo nano /etc/nginx/sites-available/recon-dashboard
# Replace your-domain.com with your actual domain or server IP
sudo nginx -t
sudo systemctl restart nginx
```

### 6. (Optional) Enable HTTPS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## PM2 Commands

```bash
pm2 status              # check running apps
pm2 logs recon-dashboard # view logs
pm2 restart recon-dashboard
pm2 stop recon-dashboard
```

## Remapping Fields

If your n8n webhook returns different field names, edit the `FIELD_*` constants at the top of the `<script>` section in `public/index.html`:

```js
const FIELD_DATE         = "Date";
const FIELD_COUNTERPARTY = "Counterparty";
const FIELD_TOTAL        = "Total";
const FIELD_INVOICE      = "InvoiceNumber";
const FIELD_DUE_DATE     = "DueDateString";
const FIELD_STATUS       = "Status";
```
