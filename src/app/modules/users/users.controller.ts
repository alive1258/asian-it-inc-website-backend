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
  ParseIntPipe,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/app/auth/decorators/auth.decorator';
import { AuthType } from 'src/app/auth/enums/auth-type.enum';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GetUsersDto } from './dto/get-users.dto';

/**
 * UsersController handles all user-related API endpoints.
 * It provides routes for user creation, retrieval, updating, and deletion.
 */
@Controller('users')
@ApiTags('Users')
export class UsersController {
  /**
   * Injects the UsersService to handle business logic for user operations.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
  
   */
  @Post()
  @ApiOperation({
    summary: 'Create a data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Data created successfully.',
  })
  @Auth(AuthType.None) // No authentication required for user registration.
  @UseInterceptors(ClassSerializerInterceptor) // Ensures sensitive fields are excluded from response.
  create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(req, createUserDto);
  }

  /**
   * Retrieves all users from the database.

   */
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }
  /**
   * Get all Member controller
   */
  @Get()
  @ApiQuery({
    name: 'limit',
    type: 'string',
    required: false,
    description: 'The number of entries returned per query',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    type: 'string',
    required: false,
    description: 'The page that wanted.',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    description: 'Search anything that you want.',
    example: 'First',
  })
  @ApiOperation({
    summary: 'Get all the Member data.',
  })
  findAll(@Req() req: Request, @Query() getUsersDto: GetUsersDto) {
    return this.usersService.findAll(req, getUsersDto);
  }

  /**
   * Retrieves a specific user by their unique ID.
 
   */
  @Get('/:id') // ✅ Correct, now properly used for fetching a single user by ID
  public getUserById(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOneById(id);
  }

  /**
   * Updates a user's information.
   
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
 
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
