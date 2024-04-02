import { DataSource, Repository,  } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Injectable, NotFoundException} from "@nestjs/common";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(private datasource:DataSource) {
        super(Task, datasource.createEntityManager());
    }
    
    async getTasks(filterDto:GetTasksFilterDTO): Promise<Task[]>{
        const { status, search} = filterDto
        const query = this.createQueryBuilder('task')

        
        if(status){
            query.andWhere('task.status = :status', { status }); 
        }

        if(search){
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                {search: `%${search}%`}
            )
        }
        const tasks = await query.getMany();
        return tasks
    }

    async getTaskByID(id: string): Promise<Task>{
        const found = await this.findOneBy({id:id})
        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found`) 
        }
        return found
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
        title,
        description,
        status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;   
}

    async deleteTaskById(id:string) :Promise<void>{ 
        const result = await this.delete(id)
        if(result.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }
    }

    async updateTaskStatus(id:string, status:TaskStatus) : Promise<Task>{
            const updatedTask = await this.getTaskByID(id)
            updatedTask.status = status
            await this.save(updatedTask)

            return updatedTask
    }

 


}
