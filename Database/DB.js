import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { existsSync, mkdirSync } from 'fs'
 
const dbDir = "./Database";
const dbFile = `${dbDir}/db.json`
if(!existsSync(dbDir))
{
    mkdirSync(dbDir)
}

const defaultData = {users:[],book:[],post:[]}

    const adapter = new JSONFile(dbFile)
    const db = new Low(adapter,defaultData)
    

export { db }