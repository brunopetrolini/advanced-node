import { PersonController } from '@/application/controllers';

describe('Person Controller', () => {
  it('person name should be spoken', () => {
    const person = new PersonController();
    expect(person.speak('name')).toBe('Hello NAME!');
    expect(person.speak()).toBe('Hello FULANO!');
  });
});
