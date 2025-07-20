import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { existsSync, mkdirSync } from 'fs'
 
const dbDir = "./Database";
const dbFile = `${dbDir}/book.json`
if(!existsSync(dbDir))
{
    mkdirSync(dbDir)
}

const defaultData = {book:[],roman:[],dictionnary:[]}

    const adapter = new JSONFile(dbFile)
    const dbbook = new Low(adapter,defaultData)
    

export { dbbook }