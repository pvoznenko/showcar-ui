const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');
const port = 5000;

const globalJSON = require('../helpers/renderContentJson.js')();
const generateHtml = require('../helpers/renderHtml.js')

const gspec = (items) => {
    let gspecFiles = [];
    Object.keys(items).forEach((el) => {
        let gspec = items[el].srcDir + '/' + el + '.gspec';
        if (fs.existsSync(gspec)) {
            gspecFiles.push(gspec);
        }
    });
    return gspecFiles;
}

app.get('/', (req, res) => {
    if (req.query['gspec']) {
        res.send(gspec(globalJSON));
    } else {
        res.send(generateHtml(globalJSON));
    }
})

app.get('/docs/:type/', (req, res) => {
    if (req.query['gspec']) {
        res.send(gspec(globalJSON));
    } else {
        let content = Object.keys(globalJSON)
                .filter((el) => {
                    return globalJSON[el].type === req.params.type &&
                        globalJSON[el].html;
                })
                .map(el => {
                    return JSON.parse(globalJSON[el].html)+'<br>';
                }).join('') || 'empty';
        res.send(generateHtml(globalJSON, content));
    }
})

app.get('/docs/:type/:group', (req, res) => {
    if (req.query['gspec']) {
        res.send(gspec(globalJSON));
    } else {
        let content = Object.keys(globalJSON)
                .filter((el) => {
                    return globalJSON[el].group === req.params.group &&
                        globalJSON[el].html;
                })
                .map(el => {
                    return JSON.parse(globalJSON[el].html)+'<br>';
                }).join('') || 'empty';
        res.send(generateHtml(globalJSON, content));
    }
})

// TODO: fix path
app.use('/showcar-ui', express.static('/Users/asolovev/scout24/source/showcar-ui/'));

app.get('*', (req, res) => {
    res.send('WTF???');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})