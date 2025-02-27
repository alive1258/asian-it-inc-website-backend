import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/app/auth/decorators/auth.decorator';
import { AuthType } from 'src/app/auth/enums/auth-type.enum';

/**
 * UsersController handles all user-related API endpoints.
 * It provides routes for user creation, retrieval, updating, and deletion.
 */
@Controller('users')
export class UsersController {
  /**
   * Injects the UsersService to handle business logic for user operations.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   * @param createUserDto - Data Transfer Object containing user details.
   * @returns The newly created user data.
   */
  @Post()
  @Auth(AuthType.None) // No authentication required for user registration.
  @UseInterceptors(ClassSerializerInterceptor) // Ensures sensitive fields are excluded from response.
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Retrieves all users from the database.
   * @returns An array of user objects.
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Retrieves a specific user by their unique ID.
   * @param id - The ID of the user.
   * @returns The user data if found.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id); // Convert id to a number before passing.
  }

  /**
   * Updates a user's information.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data Transfer Object containing updated fields.
   * @returns The updated user data.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A success message or error response.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
