<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Comment;

class ControllerComment extends Controller {
    
    public function getComments ($model, $item_id ) {

        $comments = Comment::where('model','=',$model)->where('item_id','=',$item_id)->orderBy('date','DESC')->get();

        return self::informacion($comments,true);
    
    }


    public function approved (Request $request) {

        $comment = Comment::find($request->get('id'));

        $comment->status = $request->get('status');

        $comment->update();

        return self::personalizado('comentario aprobado correctamente.',true);
    
    }

    public function notApproved (Request $request) {

        $comment = Comment::find($request->get('id'));

        $comment->status = $request->get('status');

        $comment->update();

        return self::personalizado('comentario ha espera de aprobación correctamente.',true);
    
    }

    public function delete ($id) {

        $comment = Comment::find($id);

        $comment->delete();

        return self::personalizado('comentario eliminado correctamente.',true);
    
    }

} 
