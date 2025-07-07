import { UserModel } from "./userModel";
import { UserDataStore } from "./userDataStore";
import { UserRepository } from "./userRepository";

describe("UserRepository", () => {
  let data: UserDataStore;
  let repo: UserRepository;
  let sampleInput: UserModel;
  let createdUser: UserModel;

  beforeEach(() => {
    data = new UserDataStore() as jest.Mocked<UserDataStore>;
    repo = new UserRepository(data);
    sampleInput = new UserModel();

    sampleInput.name = "Test User";
    sampleInput.email = "test@example.com";
    sampleInput.role = "Admin";

    createdUser = repo.create(sampleInput);
  });

  test("create() should add a user and return it with id and createdAt", () => {
    expect(createdUser).toMatchObject({
      name: sampleInput.name,
      email: sampleInput.email,
      role: sampleInput.role
    });
    expect(typeof createdUser.id).toBe("string");
    expect(createdUser.createdAt).toBeInstanceOf(Date);
  });

  test("findById() should return the user with the given id", () => {
    const found = repo.findById(createdUser.id);

    expect(found).toEqual(createdUser);
  });

  test("findById() should return undefined if user not found", () => {
    const found = repo.findById("nonexistent");

    expect(found).toBeUndefined();
  });


});
