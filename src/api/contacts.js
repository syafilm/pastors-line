import base from './base'

function index(params) {
  return base().get(`/contacts.json?${params}`)
}

const contacts = {
  index,
}

export default contacts
