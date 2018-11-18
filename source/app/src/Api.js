const api = "http://localhost:3001";

export function fetchCategories() {
    return fetch(`${api}/categories`).then(r => r.json());
}

export function fetchMemes(key) {
    return fetch(`${api}/memes/${key}`).then(r => r.json());
}

export function fetchTemplates(category) {
    return fetch(`${api}/templates/${category}`).then(r => r.json());
}