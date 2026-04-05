# PAIR API Documentation

## Base URL
See "Backend Stuff" Google Doc"

## Authentication
All endpoints require a token in the request header:

To get a token either follow instructions in the same google doc or contact the backend team to get your credentials.

---

## Endpoints

### Authors
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/authors/` | List all authors |
| POST | `/api/authors/` | Create new author |
| GET | `/api/authors/:id/` | Get author by ID |
| PUT | `/api/authors/:id/` | Update author |
| DELETE | `/api/authors/:id/` | Delete author |

**Author object:**
```json
{
    "full_name": "Jane Doe",
    "email": "jane@princeton.edu",
    "affiliation": "undergrad",
    "class_year": 2026,
    "major_department": "Computer Science",
    "bio": "Jane is a CS major...",
    "headshot_url": null,
    "linkedin_url": null,
    "twitter_url": null,
    "website_url": null
}
```

### Articles
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/articles/` | List all articles |
| POST | `/api/articles/` | Create new article |
| GET | `/api/articles/:id/` | Get article by ID |
| PUT | `/api/articles/:id/` | Update article |
| DELETE | `/api/articles/:id/` | Delete article |

**Article object:**
```json
{
    "title": "Article Title",
    "subtitle": "Optional subtitle",
    "section": "technical",
    "tags": "ai, machine learning",
    "abstract": "Short summary...",
    "estimated_read_time": 5,
    "publication_preference": "flexible",
    "body": "Full article content...",
    "acknowledgements": ""
}
```

### Article Authors (linking authors to articles)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/article-authors/` | List all article-author links |
| POST | `/api/article-authors/` | Link an author to an article |

**ArticleAuthor object:**
```json
{
    "article": 1,
    "author": 2,
    "is_primary": true,
    "external_name": "",
    "external_email": "",
    "external_class_year": null
}
```

### Media
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/media/` | List all media |
| POST | `/api/media/` | Upload media for an article |

**Media object:**
```json
{
    "article": 1,
    "image_url": "https://...",
    "caption": "Optional caption",
    "alt_text": "Description for accessibility",
    "credit": "Photo by...",
    "is_cover": true,
    "order": 0
}
```

---

## Enum Values

**affiliation:** `undergrad` `grad` `faculty` `other`

**section:** `technical` `opinion` `creative` `interview` `humor` `spotlight`

**publication_preference:** `asap` `next_issue` `flexible`