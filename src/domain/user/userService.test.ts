import { UserInput, IUser } from "./user";
import { UserDataStore } from "./userDataStore";
import { UserRepository } from "./userRepository";
import { UserService } from "./userService";

jest.mock("../../src/repositories/UserRepository");

describe("UserService", () => {
  let data: UserDataStore;
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    data = new UserDataStore() as jest.Mocked<UserDataStore>;
    mockRepository = new UserRepository(data) as jest.Mocked<UserRepository>;
    userService = new UserService(mockRepository);
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user and call repository.create", () => {
      const input: UserInput = { name: "Test User", email: "test@example.com", role: "Admin" };
      const createdUser: IUser = {
        id: "uuid",
        name: input.name,
        email: input.email,
        role: input.role,
        createdAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdUser);

      const result = userService.createUser(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(createdUser);
    });
  });

  describe("getUserById", () => {
    it("should return user by id using repository.findById", () => {
      const user: IUser = {
        id: "1",
        name: "User 1",
        email: "user1@example.com",
        role: "Editor",
        createdAt: new Date(),
      };

      mockRepository.findById.mockReturnValue(user);

      const result = userService.getUserById("1");

      expect(mockRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(user);
    });

    it("should return undefined if user not found", () => {
      mockRepository.findById.mockReturnValue(undefined);
      const result = userService.getUserById("nonexistent");

      expect(result).toBeUndefined();
    });
  });

});
