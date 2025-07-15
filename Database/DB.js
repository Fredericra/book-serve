import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const defaultData = {users:[],book:[],post:[]}
const adapter = new JSONFile('db.json')
const db = new Low(adapter,defaultData)


export { db }