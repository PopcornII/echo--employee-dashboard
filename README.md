`Upload documentation in Dashboard`

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


# Features :
- Allow Guest View Documentation
- Allow Student View Documentation, Comment, Liked
- Allow Teacher View Documentation, Reply to, Comment, Liked, Upload, Delete, Edit

Tech Doc
- Login , Logout
- User Management
- Role Management
- Document List Management



`Document List Response`
  "data": {
    "id": 1,
    "title": "Sample Document",
    "description": "This is a sample document.",
    "file_url": "https://example.com/uploads/sample-document.pdf",
    "img_url": "https://example.com/uploads/sample-image.jpg",
    "uploader_id": 123
  }


  - Bug Tracking
    - Error Page Relaod missing token



