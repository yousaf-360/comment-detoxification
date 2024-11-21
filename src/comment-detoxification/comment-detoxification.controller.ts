import { Controller, Post, Body } from '@nestjs/common';
import { CommentDetoxificationService } from './comment-detoxification.service';
import { DetoxifyCommentDto } from './dto/detoxify-comment.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@Controller('comment-detoxification')
export class CommentDetoxificationController {
    constructor(private readonly commentService: CommentDetoxificationService){};
    @Post('detoxify')
    @ApiOperation({summary:'Comment detoxification service'})
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
