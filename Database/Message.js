import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { existsSync, mkdirSync } from 'fs'
 
const dbDir = "./Database";
const dbFile = `${dbDir}/message.json`
if(!existsSync(dbDir))
{
    mkdirSync(dbDir)
}

const defaultData = {messages:[]}

    const adapter = new JSONFile(dbFile)
    const newLetters = new Low(adapter,defaultData)
    

export { newLetters }