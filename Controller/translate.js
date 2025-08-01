import axios from 'axios'


export const translate = async (req, res) => {
    const { text, to } = req.body
    try {
        const options = {
            method: 'POST',
            url: 'https://google-api31.p.rapidapi.com/gtranslate',
            headers: {
                'x-rapidapi-key': 'ac7c515e5fmshade998100f69596p12b2dbjsn72a9f5277e7f',
                'x-rapidapi-host': 'google-api31.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                text: text,
                to: to,
                from_lang: ''
            }
        };
        const response = await axios.request(options);
        res.status(201).send(response)
        console.log(response.data);
    } catch (error) {
        res.status(201).send('error', error);
    }
}

