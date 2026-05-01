/**
 * Interface defining the structure of an Author
 */
export interface Author {
    firstName: string;
    lastName: string;
    fullName: string;
}

/**
 * The source-of-truth list of validated authors.
 * Using 'as const' ensures the data is read-only and types are literal.
 */
export const VALID_AUTHORS: Author[] = [
    { firstName: "Samiksha", lastName: "Gaherwar", fullName: "Samiksha Gaherwar" },
    { firstName: "Eshaan", lastName: "Govil", fullName: "Eshaan Govil" },
    { firstName: "Vivian", lastName: "Huang", fullName: "Vivian Huang" },
    { firstName: "Emily", lastName: "Yang", fullName: "Emily Yang" },
    { firstName: "Nachu", lastName: "Annamalai", fullName: "Nachu Annamalai" },
    { firstName: "Anna", lastName: "Xie", fullName: "Anna Xie" },
    { firstName: "Chinmaya", lastName: "Saran", fullName: "Chinmaya Saran" },
    { firstName: "Jonathan", lastName: "Liu", fullName: "Jonathan Liu" },
    { firstName: "Nuhayd", lastName: "Omar", fullName: "Nuhayd Omar" },
    { firstName: "Raj", lastName: "Patel", fullName: "Raj Patel" },
    { firstName: "Charles", lastName: "Muehlberger", fullName: "Charles Muehlberger" },
    { firstName: "Vishrut", lastName: "Thoutam", fullName: "Vishrut Thoutam" },
    { firstName: "Seojin", lastName: "Moon", fullName: "Seojin Moon" },
    { firstName: "Emilio", lastName: "Medina Castellanos", fullName: "Emilio Medina Castellanos" },
    { firstName: "Grace", lastName: "Im", fullName: "Grace Im" },
    { firstName: "Matthew", lastName: "Lee", fullName: "Matthew Lee" },
    { firstName: "Aikhan", lastName: "Jumashukurov", fullName: "Aikhan Jumashukurov" },
    { firstName: "Reem", lastName: "Belafkih", fullName: "Reem Belafkih" },
    { firstName: "Isaac", lastName: "Kang", fullName: "Isaac Kang" },
    { firstName: "Kevin", lastName: "Park", fullName: "Kevin Park" },
    { firstName: "Ari", lastName: "Gomez", fullName: "Ari Gomez" },
    { firstName: "Deeksha", lastName: "Chaudhari", fullName: "Deeksha Chaudhari" },
    { firstName: "Monika", lastName: "Mommsen", fullName: "Monika Mommsen" },
    { firstName: "Jeevan", lastName: "Sailesh", fullName: "Jeevan Sailesh" },
    { firstName: "Mathias", lastName: "Nguyen-Van-Duong", fullName: "Mathias Nguyen-Van-Duong" },
    { firstName: "Miguel", lastName: "Pinero-Jacome", fullName: "Miguel Pinero-Jacome" },
    { firstName: "Stephy", lastName: "Zhang", fullName: "Stephy Zhang" },
    { firstName: "Lynn", lastName: "Morris", fullName: "Lynn Morris" },
    { firstName: "Tyler", lastName: "Pellek", fullName: "Tyler Pellek" },
    { firstName: "Jackie", lastName: "Chan", fullName: "Jackie Chan" },
] as const;

/**
 * Validation Utility
 * Checks if a provided name matches any author in the list.
 * * @param input - The full name string to validate
 * @returns boolean
 */
export const isValidAuthor = (input: string): boolean => {
    if (!input) return false;

    const normalizedInput = input.trim().toLowerCase();

    return VALID_AUTHORS.some(
        (author) => author.fullName.toLowerCase() === normalizedInput
    );
};

/**
 * Alternative Validation Utility (Strict First/Last check)
 */
export const isValidAuthorNameParts = (first: string, last: string): boolean => {
    const f = first.trim().toLowerCase();
    const l = last.trim().toLowerCase();

    return VALID_AUTHORS.some(
        (a) => a.firstName.toLowerCase() === f && a.lastName.toLowerCase() === l
    );
};