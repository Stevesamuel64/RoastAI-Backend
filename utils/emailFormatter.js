import dotenv from "dotenv";
dotenv.config();

export function formatPremiumNewsEmail(newsItems) {
  console.log("Request is coming to the formatPremiumNewsEmail function", "Type:", typeof newsItems, Array.isArray(newsItems))
  try {
    newsItems = Array.isArray(newsItems) ? newsItems : JSON.parse(newsItems);
  } catch (err) {
    console.error("Invalid JSON:", err.message);
    return;
  }


  return `
     <div style="font-family: 'Inter','Helvetica Neue',Arial,sans-serif; max-width:720px; margin:40px auto; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 8px 28px rgba(0,0,0,0.08); border:1px solid #e2e8f0;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#eef2ff,#dbeafe);margin-bottom:40px; padding:32px 24px; text-align:center; border-bottom:1px solid #e2e8f0;">
    <h1 style="margin:0; font-size:28px; font-weight:700; color:#1e293b; letter-spacing:-0.5px;">
      📰 Daily News RoastAI
    </h1>
    <p style="margin:8px 0 0; font-size:15px; color:#475569; font-weight:400;">Your AI-curated headlines, fresh every morning</p>
  </div>

  <!-- News Content -->
  <div style="padding:26px 40px; background:#ffffff; color:#1e293b;">
    ${newsItems.map((item) => `
      <div style="margin-bottom:40px;padding:20px 30px; border:1px solid #e5e7eb; border-radius:16px; background:#fafafa; word-wrap:break-word; overflow-wrap:break-word;">
        
        <!-- Heading -->
        <h2 style="margin:0 0 12px; font-size:21px; font-weight:600; color:#1e293b;">
          ${item.title}
        </h2>

        <!-- Subheading -->
        <h3 style="margin:0 0 8px; font-size:14px; font-weight:500; color:#64748b;">Quick Summary</h3>

        <!-- Body -->
        <p style="margin:0; font-size:14px; font-weight:300; line-height:1.6; color:#374151; word-wrap:break-word; overflow-wrap:break-word;">
            ${(item.content || item.description || "No summary available").split('… [+')[0]}
        </p>
  
        <!-- Read More (optional) -->
        ${item.link ? `<a href="${item.link}" style="display:inline-block; margin-top:12px; font-size:14px; font-weight:500; color:#2563eb; text-decoration:none;">Read more →</a>` : ""}
      </div>
    `).join('')}
  </div>

  <!-- Footer -->
  <div style="background:#f8fafc; padding:18px 24px; text-align:center; font-size:12.5px; color:#64748b; border-top:1px solid #e2e8f0;">
    <p style="margin:0; font-weight:500;">You’re receiving this email because you subscribed to <b>Daily News RoastAI</b>.</p>
    <p style="margin:6px 0 0;"><a href="#" style="color:#2563eb; text-decoration:none; font-weight:500;">Unsubscribe</a> • Powered by AI</p>
  </div>

</div>

  `;
}