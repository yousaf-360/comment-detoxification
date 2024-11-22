import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CommentDetoxificationService } from './comment-detoxification.service';
import { DetoxifyCommentDto } from './dto/detoxify-comment.dto';
import { ApiTags,ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('comment-detoxification')
export class CommentDetoxificationController {
    constructor(private readonly commentService: CommentDetoxificationService){};
    @Post('detoxify')
    @ApiOperation({summary:'Comment detoxification service'})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth() 
    async getCommentDetoxification(@Body() detoxifyCommentDto:DetoxifyCommentDto){
        const {comment} = detoxifyCommentDto;

        const detoxifiedComment = await this.commentService.detoxifyComment(comment);

        await this.commentService.storeComment(comment,detoxifiedComment);

        return {
            original : comment,
            detoxified :detoxifiedComment
        }

    }

    @Post('classification')
    @ApiOperation({summary : 'Classify the text'})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async classifyText(@Body() detoxifyCommentDto:DetoxifyCommentDto){
        const {comment} = detoxifyCommentDto;
        const response = await this.commentService.rateToxification(comment);
        await this.commentService.storeRating(comment,response);
        return {
            comment:comment,
            response:response,
        }
    }



}
