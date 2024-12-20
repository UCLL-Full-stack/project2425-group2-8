import { Profile } from '../../model/profile';
import { User } from '../../model/user';
import { Role } from '../../types';

const user = new User({
    id: 1,
    username: 'testuser',
    password: 'password',
    profile: {} as Profile,
    role: 'user' as Role,
});

const profileData = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
};

test('given: valid values for profile, when: profile is created, then: profile is created with those values', () => {
    const profile = new Profile(profileData);

    expect(profile.getId()).toBe(profileData.id);
    expect(profile.getFirstName()).toBe(profileData.firstName);
    expect(profile.getLastName()).toBe(profileData.lastName);
    expect(profile.getEmail()).toBe(profileData.email);
});

test('given: missing first name, when: profile is created, then: error is thrown', () => {
    expect(() => {
        new Profile({
            ...profileData,
            firstName: '',
        });
    }).toThrow('First name is required and cannot be empty');
});

test('given: missing last name, when: profile is created, then: error is thrown', () => {
    expect(() => {
        new Profile({
            ...profileData,
            lastName: '',
        });
    }).toThrow('Last name is required and cannot be empty');
});

test('given: missing email, when: profile is created, then: error is thrown', () => {
    expect(() => {
        new Profile({
            ...profileData,
            email: '',
        });
    }).toThrow('Email is required and cannot be empty');
});

test('given: new first name, when: first name is set, then: first name is updated', () => {
    const profile = new Profile(profileData);
    const newFirstName = 'NewFirstName';
    profile.setFirstName(newFirstName);
    expect(profile.getFirstName()).toBe(newFirstName);
});

test('given: new last name, when: last name is set, then: last name is updated', () => {
    const profile = new Profile(profileData);
    const newLastName = 'NewLastName';
    profile.setLastName(newLastName);
    expect(profile.getLastName()).toBe(newLastName);
});

test('given: new email, when: email is set, then: email is updated', () => {
    const profile = new Profile(profileData);
    const newEmail = 'newemail@example.com';
    profile.setEmail(newEmail);
    expect(profile.getEmail()).toBe(newEmail);
});