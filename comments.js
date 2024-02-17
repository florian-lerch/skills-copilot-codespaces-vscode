// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments.json');

// Create server
http.createServer((req, res) => {
    const {pathname, query} = url.parse(req.url, true);
    if (pathname === '/api/comments') {
        if (req.method === 'GET') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(comments));
        } else if (req.method === 'POST') {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                const comment = JSON.parse(data);
                comment.id = Date.now();
                comments.push(comment);
                fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), 'utf8', err => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Server error');
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(comments));
                    }
                });
            });
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
}).listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```
- In the above code, we create a web server that listens on port 3000. When a user sends a GET request to /api/comments, the server sends back the comments in JSON format. When a user sends a POST request to /api/comments, the server adds the new comment to the comments array and sends back the updated comments in JSON format.
- We use the url module to parse the request URL to get the pathname and query string. If the pathname is /api/comments, we handle the request accordingly. If the request method is GET, we send back the comments in JSON format. If the request method is POST, we read the request body and parse it to get the new comment. We add an id to the comment and push it to the comments array. Then we write the updated comments to the comments.json file and send back the updated comments in JSON format.
- We use the fs module to read and write the comments to the comments.json file. We use the path module to construct the file path.
```