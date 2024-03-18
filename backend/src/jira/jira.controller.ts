import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JiraService } from './jira.service';
import { UpdateJiraDto } from './dto/updateJira';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';

@Controller('jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getJira() {
    return this.jiraService.getJira();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  updateJira(@Body() updateJiraDto: UpdateJiraDto) {
    return this.jiraService.updateJira(updateJiraDto);
  }
}
