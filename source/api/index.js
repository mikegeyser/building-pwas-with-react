const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const memes = [
    // lotr
    { id: 1, category: 'lotr', template: "one-does-not-simply.png", top: "One does not simply go", bottom: "offline first" },
    { id: 2, category: 'lotr', template: "and-my-axe.jpg", top: "And my", bottom: "service worker!" },
    { id: 3, category: 'lotr', template: "you-have-no-power-here.jpg", top: "Internet Explorer", bottom: "You have no power here!" },
    { id: 4, category: 'lotr', template: "elevenses.png", top: "What do you mean", bottom: "cache invalidation?" },
    { id: 5, category: 'lotr', template: "legolas.jpg", top: "I hear the internet", bottom: "losing its mind" },
    { id: 5, category: 'lotr', template: "mine.jpg", top: "I should have", bottom: "gone native!" },
    { id: 6, category: 'lotr', template: "not-this-day.jpg", top: "One day we'll support IE", bottom: "But not this day!" },
    { id: 7, category: 'lotr', template: "oh-no.png", top: "I have to use", bottom: "TypeScript" },
    { id: 8, category: 'lotr', template: "orc.jpg", top: "what do you mean", bottom: "there's no upgrade path?" },

    // sw
    { id: 31, category: 'sw', template: "speechless-luke.jpg", top: "", bottom: "\"...\"" },
    { id: 32, category: 'sw', template: "bb-8-thumbs-up.jpg", top: "Works on", bottom: "my machine" },
    { id: 33, category: 'sw', template: "not-the-droids.jpg", top: "There are no", bottom: "bugs here" },
    { id: 34, category: 'sw', template: "deathstar-explosion.jpg", top: "Friday afternoon", bottom: "deployments" },

    // corgi
    { id: 11, category: "corgi", template: "IDrive.jpg", top: "I know", bottom: "the javascripts" },
    { id: 12, category: "corgi", template: "battle.jpg", top: "tabs vs.", bottom: "spaces" },
    { id: 13, category: "corgi", template: "corgidown.jpg", top: "Turn it off and", bottom: "on again" },
    { id: 14, category: "corgi", template: "maxderp.jpg", top: "successful", bottom: "deployment" },
    { id: 15, category: "corgi", template: "mistake.jpg", top: "Performance", bottom: "is fine" },
    { id: 16, category: "corgi", template: "treats.jpg", top: "There are no", bottom: "bugs here" },

    // rs
    { id: 21, category: "rs", template: "ron-swanson.jpg", top: "Would you put your", bottom: "salary off through that" },
    { id: 22, category: "rs", template: "ron-swanson.jpg", top: "That word doesn't mean", bottom: "what you think it means" },
    { id: 23, category: "rs", template: "ron-swanson.jpg", top: "as such", bottom: "though" },

];

const categories = [
    { key: 'lotr', description: 'Lord of the Rings' },
    { key: 'sw', description: 'Star Wars' },
    { key: 'corgi', description: 'Corgies' },
    { key: 'rs', description: 'Ron Swanson' },
];

const base_url = 'public/images';

const templates = {
    lotr: [
        'and-my-axe.jpg',
        'elevenses.png',
        'legolas.jpg',
        'mine.jpg',
        'not-this-day.jpg',
        'oh-no.png',
        'one-does-not-simply.png',
        'orc.jpg',
        'survived.png',
        'yes.jpg',
        'you-have-no-power-here.jpg'
    ],
    sw: [
        'speechless-luke.jpg',
        'bb-8-thumbs-up.jpg',
        'not-the-droids.jpg',
        'deathstar-explosion.jpg'
    ],
    rs: ['ron-swanson.jpg'],
    corgi: [
        'IDrive.jpg',
        'battle.jpg',
        'corgidown.jpg',
        'maxderp.jpg',
        'mistake.jpg',
        'treats.jpg'
    ]
};

app.use('/public', express.static('public'));

app.get('/categories', (req, res) => res.json(categories));
app.get('/memes', (req, res) => {
    const response = memes.map((meme) => {
        return {
            ...meme,
            template: absoluteTemplatePath(req, meme.category, meme.template)
        };
    });

    res.json(response);
});

app.get('/memes/:category', (req, res) => {
    const category = req.params.category;
    const filtered = memes.filter((meme) => meme.category === category)
        .map((meme) => {
            return {
                ...meme,
                template: absoluteTemplatePath(req, category, meme.template)
            };
        });

    res.json(filtered);
});

app.get('/templates/:category', (req, res) => {
    const category = req.params.category;
    const filtered = templates[category].map(template => {
        return {
            fileName: template,
            fullPath: absoluteTemplatePath(req, category, template)
        };
    });

    res.json(filtered);
});

app.post('/memes', (req, res) => {
    memes.unshift(req.body);
    res.send(200, {});
});

app.listen(3001, () => console.log('Running on port 3001.'));

function absoluteTemplatePath(req, category, template) {
    if (template.match(/^http/)) {
        return template;
    }

    return `${req.protocol}://${req.get('host')}/${base_url}/${category}/${template}`;
}