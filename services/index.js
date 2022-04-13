import user from './user'
import role from './role'
import permission from './permission'
import profile from './profile'
import account from './account'
import client from './client'
import lead from './lead'
import contact from './contact'
import job from './job'
import task from './task'
import order from './order'
import invoices from './invoices'
import taskTemplate from './taskTemplate'

export default ($axios) => ({
  user: user($axios),
  role: role($axios),
  permission: permission($axios),
  profile: profile($axios),
  account: account($axios),
  client: client($axios),
  lead: lead($axios),
  contact: contact($axios),
  job: job($axios),
  task: task($axios),
  order: order($axios),
  invoices: invoices($axios),
  taskTemplate: taskTemplate($axios)
})
