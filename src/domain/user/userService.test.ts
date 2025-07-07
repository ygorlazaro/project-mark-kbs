import { UserModel } from "./userModel";
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
      const input = new UserModel();

      input.name = "Test User";
      input.email = "test@example.com";
      input.role = "Admin";

      const createdUser: UserModel = {
        id: "uuid",
        name: input.name,
        email: input.email,
        role: input.role,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt
      };

      mockRepository.create.mockReturnValue(createdUser);

      const result = userService.create(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(createdUser);
    });
  });

  describe("getUserById", () => {
    it("should return user by id using repository.findById", () => {
      const user = new UserModel();

      user.id = "1";
      user.name = "User 1";
      user.email = "user1@example.com";
      user.role = "Editor";
      user.createdAt = new Date();
      user.updatedAt = new Date();

      mockRepository.findById.mockReturnValue(user);

      const result = userService.findById("1");

      expect(mockRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(user);
    });

    it("should return undefined if user not found", () => {
      mockRepository.findById.mockReturnValue(undefined);
      const result = userService.findById("nonexistent");

      expect(result).toBeUndefined();
    });
  });

});
