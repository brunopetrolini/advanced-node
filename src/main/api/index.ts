import '../config/module-alias'

import { PersonController } from "@/application/controllers"

const person = new PersonController()
console.log(person.speak('bruno'))
console.log(person.speak())
