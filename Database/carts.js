import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { existsSync, mkdirSync } from 'fs'
 
const dbDir = "./Database";
const dbFile = `${dbDir}/carts.json`
if(!existsSync(dbDir))
{
    mkdirSync(dbDir)
}

const defaultData = {settings:[]}

    const adapter = new JSONFile(dbFile)
    const carts = new Low(adapter,defaultData)
    

export { carts }