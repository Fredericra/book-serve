import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { existsSync, mkdirSync } from 'fs'
 
const dbDir = "./Database";
const dbFile = `${dbDir}/Products.json`
if(!existsSync(dbDir))
{
    mkdirSync(dbDir)
}

const defaultData = {lists:[]}

    const adapter = new JSONFile(dbFile)
    const Products = new Low(adapter,defaultData)
    

export { Products }