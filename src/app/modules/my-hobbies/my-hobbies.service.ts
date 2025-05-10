import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMyHobbyDto } from './dto/create-my-hobby.dto';
import { UpdateMyHobbyDto } from './dto/update-my-hobby.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MyHobby } from './entities/my-hobby.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { FileUploadsService } from './../../common/file-uploads/file-uploads.service';
import { Request } from 'express';
import { GetMyHobbyDto } from './dto/get-my-hobby.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class MyHobbiesService {
constructor(

  @InjectRepository(MyHobby)
  private readonly myHobbyRepository: Repository<MyHobby>,

  private readonly dataQueryService: DataQueryService,
  private readonly fileUploadsService: FileUploadsService,
) {}

public async  create(
  req:Request,
  createMyHobbyDto: CreateMyHobbyDto,
  file?: Express.Multer.File):Promise<MyHobby> {
  const user_id=req?.user?.sub
  if(!user_id){
    throw new UnauthorizedException('User ID is required.You have to sing in!');
  }
const existMyHobby=await this.myHobbyRepository.findOne({where:{title:createMyHobbyDto.title}})
if(existMyHobby){
  throw new BadRequestException('This hobby already exists');
}

let photo:string|undefined;
if(file){
  const uploaded=await this.fileUploadsService.fileUploads(file)
  photo=Array.isArray(uploaded)?uploaded[0]:uploaded;
}

//create new myHobby
const newMyHobby=this.myHobbyRepository.create({
  ...createMyHobbyDto,
  added_by:user_id,
  photo}
  );
  const myHobby=await this.myHobbyRepository.save(newMyHobby);
  return myHobby;



}

 public async findAll(getMyHobbyDto:GetMyHobbyDto):Promise<IPagination<MyHobby>> {
   const searchableFields = ['title', 'description'];
   const { limit, page, search ,...filters } = getMyHobbyDto;
   const myHobbies=this.dataQueryService.dataQuery({
    paginationQuery:{limit, page,search,filters},
    searchableFields,
    repository: this.myHobbyRepository,
   })
   return myHobbies;
  }

public async  findOne(id: string):Promise<MyHobby> {
  const myHobby=await this.myHobbyRepository.findOne({
      where: {
        id,
      },
    });
    if(!myHobby){
      throw new BadRequestException('This hobby does not exist');
    }
    return myHobby;
 
  }

public async  update(id: string, updateMyHobbyDto: UpdateMyHobbyDto,
file?: Express.Multer.File
):Promise<MyHobby> {
    
if(!id){
  throw new BadRequestException('MyHobby ID is required');
}

const existingMyHobby = await this.myHobbyRepository.findOneBy({
      id,
    });

if(!existingMyHobby){
  throw new BadRequestException('This hobby not found');
}


let photo:string | string[] | undefined;
if(file && existingMyHobby.photo){
  photo=await this.fileUploadsService.updateFileUploads({
    oldFile:existingMyHobby.photo,
    currentFile:file,
  })
}

updateMyHobbyDto.photo=photo as string | undefined
 Object.assign(existingMyHobby,updateMyHobbyDto)
 return await this.myHobbyRepository.save(existingMyHobby);


  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    try {
      const myHobby = await this.findOne(id);

      if (!myHobby) {
        throw new NotFoundException('myHobby not found');
      }

      //delete associated photo if it exists
      if (myHobby.photo) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          myHobby.photo,
        );
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete photo');
        }
      }

      //proceed to delete the myHobby
      await this.myHobbyRepository.remove(myHobby);

      return { message: 'myHobby deleted successfully' };
    } catch (error) {
      // Log it or handle known DB/File errors differently if needed
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
