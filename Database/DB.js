import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const defaultData = {users:[]}
const adapter = new JSONFile('./Database/db.json')
const db = new Low(adapter,defaultData)


export { db }