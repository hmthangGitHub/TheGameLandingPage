import { onValueCreated } from "firebase-functions/v2/database";
import * as admin from "firebase-admin";
import { defineString } from "firebase-functions/params";

// Initialize Firebase Admin
admin.initializeApp();

// Define the Brevo API key as a parameter
const brevoApiKey = defineString("BREVO_API_KEY");

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Cloud Function triggered when a new subscriber is added to Realtime Database
 */
export const onSubscriberCreated = onValueCreated(
  "/subscribers/{emailKey}",
  async (event) => {
    const subscriberData = event.data.val();
    const emailKey = event.params.emailKey;

    console.log("New subscriber added:", emailKey);
    console.log("Subscriber data:", subscriberData);

    // Extract email from data (emailKey might be sanitized)
    const email = subscriberData.email || emailKey.replace(/_/g, ".");

    try {
      // Send welcome email using Brevo HTTP API
      const emailData = {
        sender: {
          name: "Last Z: Survival Shooter",
          email: "pandabproduction2020@gmail.com",
        },
        to: [
          {
            email: email,
          },
        ],
        subject: "🎮 Welcome! Priority Access Granted - Last Z: Survival",
        htmlContent: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Priority Access Granted</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                padding: 20px;
                line-height: 1.6;
              }
              
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
              }
              
              .header {
                background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
              }
              
              .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 3s ease-in-out infinite;
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
              }
              
              .logo {
                font-size: 28px;
                font-weight: 900;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 10px;
                text-shadow: 0 2px 10px rgba(0,0,0,0.3);
                position: relative;
                z-index: 1;
              }
              
              .badge {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                color: #ffffff;
                padding: 8px 20px;
                border-radius: 50px;
                font-size: 14px;
                font-weight: 600;
                margin-top: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                position: relative;
                z-index: 1;
              }
              
              .content {
                padding: 50px 40px;
                color: #e5e5e5;
              }
              
              .title {
                font-size: 32px;
                font-weight: 900;
                color: #ffffff;
                margin-bottom: 20px;
                text-align: center;
                background: linear-gradient(135deg, #ffffff 0%, #dc2626 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              
              .greeting {
                font-size: 20px;
                font-weight: 700;
                color: #dc2626;
                margin-bottom: 25px;
                text-align: center;
              }
              
              .text {
                font-size: 16px;
                color: #d4d4d4;
                margin-bottom: 18px;
                line-height: 1.8;
              }
              
              .highlight-box {
                background: rgba(220, 38, 38, 0.1);
                border-left: 4px solid #dc2626;
                padding: 20px 25px;
                margin: 30px 0;
                border-radius: 10px;
              }
              
              .highlight-box p {
                margin: 0;
                font-size: 16px;
                color: #ffffff;
              }
              
              .email-highlight {
                color: #dc2626;
                font-weight: 700;
                background: rgba(220, 38, 38, 0.1);
                padding: 2px 8px;
                border-radius: 4px;
              }
              
              .features {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
              }
              
              .feature-item {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
              }
              
              .feature-item:last-child {
                margin-bottom: 0;
              }
              
              .feature-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-size: 20px;
                flex-shrink: 0;
              }
              
              .feature-text {
                color: #d4d4d4;
                font-size: 15px;
              }
              
              .cta-section {
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              }
              
              .cta-text {
                font-size: 18px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 15px;
              }
              
              .footer {
                background: #0a0a0a;
                padding: 30px 40px;
                text-align: center;
                color: #737373;
                font-size: 13px;
              }
              
              .footer-logo {
                font-weight: 700;
                color: #dc2626;
                margin-bottom: 10px;
              }
              
              .social-links {
                margin: 20px 0;
              }
              
              .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #737373;
                text-decoration: none;
                transition: color 0.3s;
              }
              
              .social-links a:hover {
                color: #dc2626;
              }
              
              @media only screen and (max-width: 600px) {
                .email-container {
                  border-radius: 0;
                }
                
                .content {
                  padding: 30px 25px;
                }
                
                .title {
                  font-size: 26px;
                }
                
                .greeting {
                  font-size: 18px;
                }
                
                .header {
                  padding: 30px 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header -->
              <div class="header">
                <div class="logo">🧟 LAST Z: SURVIVAL</div>
                <div class="badge">✨ PRIORITY ACCESS</div>
              </div>
              
              <!-- Content -->
              <div class="content">
                <h1 class="title">Priority Access Confirmed</h1>
                <p class="greeting">Welcome, Early Survivor! 🎯</p>
                
                <p class="text">
                  The apocalypse is coming, and you're <strong>first in line</strong>.
                </p>
                
                <p class="text">
                  We're thrilled to have you join us on this journey. Thank you for believing in Last Z: Survival and being part of our early community!
                </p>
                
                <div class="highlight-box">
                  <p>
                    <strong>🗓️ What's Next?</strong><br/>
                    We're in the final stages of development. Because you signed up early, 
                    you'll receive <strong>Priority Access</strong> when the beta goes live next month.
                  </p>
                </div>
                
                <div class="features">
                  <div class="feature-item">
                    <div class="feature-icon">🎮</div>
                    <div class="feature-text">
                      <strong>Early Beta Access</strong> - Play before anyone else
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">🔑</div>
                    <div class="feature-text">
                      <strong>Exclusive Beta Code</strong> - Reserved just for you
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">📬</div>
                    <div class="feature-text">
                      <strong>Launch Updates</strong> - Be the first to know
                    </div>
                  </div>
                </div>
                
                <p class="text" style="margin-top: 30px;">
                  We'll notify you at <span class="email-highlight">${email}</span> 
                  the moment the beta goes live with your exclusive access code.
                </p>
                
                <div class="cta-section">
                  <p class="cta-text">Stay alert.</p>
                  <p style="color: #737373; font-size: 14px;">The countdown has begun ⏱️</p>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <div class="footer-logo">Last Z: Survival Shooter</div>
                <p>© 2026 Panda B Production. All rights reserved.</p>
                <p style="margin-top: 15px; color: #525252;">
                  You're receiving this because you signed up for early access.<br/>
                  Prepare yourself. The apocalypse waits for no one.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Priority Access Granted
          
          Welcome, Early Survivor!
          
          Thank you for subscribing. We're thrilled you want to join us!
          
          We are currently in the final stages of building the game.
          Because you're an early bird, you'll get Priority Access when we
          launch next month.
          
          We'll notify you at ${email} with your beta code.
          
          Stay tuned!
        `,
      };

      const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "api-key": brevoApiKey.value(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Email sent successfully:", result);

      return null;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
);

