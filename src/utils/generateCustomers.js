import { faker } from '@faker-js/faker';

/**
 * Generate an array of customer objects for use in the application. Each customer
 * has a unique id (starting at 1), a full name, phone number, email address,
 * score (0–100), last message timestamp, addedBy name and an avatar URL. The
 * avatar uses the i.pravatar.cc service and cycles through 70 available images
 * by taking the customer id modulo 70.
 *
 * @param {number} count The number of customer records to generate.
 * @returns {Array<Object>} A list of generated customer objects.
 */
export function generateCustomers(count) {
  const customers = new Array(count);
  for (let id = 1; id <= count; id++) {
    const name = faker.person.fullName();
    const phone = faker.phone.number();
    // Generate a generic email address. Passing names is optional; leaving it
    // blank produces a random email which is sufficient for mock data.
    const email = faker.internet.email();
    const score = faker.number.int({ min: 0, max: 100 });
    const lastMessageAt = faker.date.recent({ days: 30 }).toISOString();
    const addedBy = faker.person.firstName();
    const avatar = `https://i.pravatar.cc/150?img=${id % 70}`;
    customers[id - 1] = { id, name, phone, email, score, lastMessageAt, addedBy, avatar };
  }
  return customers;
}