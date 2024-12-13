# Blink (Backend)

An API service for shortening URLs, with additional features for analytics, rate limiting, and monetization.

## Why "B-link"?
The name “B-link” captures the essence of the service: quick and compact, like a blink. The ‘B’ symbolizes ‘better’ and ‘link,’ reflecting our commitment to providing better, faster, and more efficient links for users.

## Features
1. **Shorten Long URLs**: Convert long URLs into short, shareable URLs.
2. **Redirection**: Use the short URL to redirect to the original long URL.
3. **Rate Limiting**: Restrict excessive usage to 20 requests per day per URL.
4. **Monetization**: Redirect every 10th request to an advertisement page.
5. **Analytics**: Retrieve hit counts and top-ranking URLs.

---

## Getting Started

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/nithashifana/blink.git
   cd blink
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up MongoDb
4. Start the server:
   ```bash
   npm start
   ```
---

The backend is hosted on Render. You can access it at the following URL:
> https://blink-uu0r.onrender.com

---

## **Example cURL Requests**

1. **Shorten long URL**:
    ```bash
    curl -X POST https://blink-uu0r.onrender.com/shorten -H "Content-Type: application/json" -d '{"longUrl": "https://github.com/nithashifana"}'
    ```

2. **Redirect**:
    ```bash
    curl -X GET https://blink-uu0r.onrender.com/redirect/<shortUrl>
    ```

3. **getUrlDetails**:
    ```bash
   curl -X GET https://blink-uu0r.onrender.com/details/<shortUrl>
    ```

4. **TopUrl**:
    ```bash
   curl -X GET https://blink-uu0r.onrender.com/top/<number> | jq
    ```
    
---

## Technologies Used
- **Node.js**: Backend framework.
- **Express.js**: Routing and middleware.
- **MongoDB**: Database for URL mapping and analytics.
- **Render**: Deployment platform.

---

## License
This project is licensed under the [MIT License](LICENSE).
