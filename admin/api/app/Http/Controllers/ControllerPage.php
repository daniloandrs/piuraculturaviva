<?php

namespace App\Http\Controllers;;

use Illuminate\Http\Request;
use App\Slider;
use App\Libro;
use App\Member;
use App\Category;
use App\Gallery;
use App\Post;
use App\Business;
use App\Event;
use App\Blog;
use App\FormContact;
use DB;
use Carbon\Carbon;
use App\Comment;
use App\VirtualTours;

class ControllerPage extends Controller {

    public function getSlider () {

        $slider = Slider::where('show','=',true)->get();
       
        return self::informacion($slider,true);
    }

    public function downloadBook () {
        
        $file_path = storage_path().'/app/Piura_al_2032_Una_visión_urbana_de_los_ciudadanos_de_Piura_para_Piura_Stella_Schroeder_2020.pdf';

        return response()->download($file_path);
    }

    public function getLibro (Request $request) {

        $key_post = $request->get('key_post');

        $post = Libro::where('key_post','=',$key_post)->first();

        $post->libro_galeria;

        return self::informacion($post,true);
    }

    public function getCategories () { 

        $category = Category::with('sub_category')->where('category_type_id','=',Category::CATEGORY_TYPE_MEMBER)->get();

        return self::informacion($category,true);
    }

    public function getMembers (Request $request) {

        $sub_category_id = $request->get('sub_category_id');

        $query = Member::query();
        
        if ($sub_category_id) {

            $query->whereHas('sub_category_member', function ($category) use ($sub_category_id) {
                $category->where('sub_category_member.sub_category_id','=',$sub_category_id);
            });
            
        } 

        $members = $query->get();

        return self::informacion($members,true);
    }

    public function getMemberProfile (Request $request) {

        $member_url = $request->get('member_url');

        $member = Member::where('url','=',$member_url)->first();

        if (isset($member)) {

            $member->photos;

            $member->sub_category_member;
            
            foreach ($member->sub_category_member as  $value) {
                $value->category;
            }

            $member->visits =  $member->visits + 1;

            $member->update();

        } else {
            $member = [];
        }

        return self::informacion($member,true);

    }

    public function getGalleries () {

        $galeries = Gallery::orderBy('num_orden', 'DESC')->get();

        return self::informacion($galeries,true);
        
    }

    public function getCategoriesAndMembers (Request $request) {

        $categories = Category::where('category_type_id','=',Category::CATEGORY_TYPE_MEMBER)->get();


        foreach ($categories as $item ) {
            
            foreach ($item->sub_category as $sub_category) {
                # code...
               // dd($sub_category->member);
               $item->total = $sub_category->member->count();
            }
            //$item->sub_category;

          //  $item->total = $item->member->count();
        }
        
        $otherMembers = Member::where('id','!=',$request->get('member_id'))->get();

        $data = [
            'categories' => $categories,
            'otherMembers' => $otherMembers
        ];

        return self::informacion($data,true);

    }


    public function getPhotos (Request $request) {

        $gallery = Gallery::find($request->get('gallery_id'));

        return self::informacion($gallery->photos,true);
    }

    public function getPost () {

        $post = Post::orderBy('publication_date', 'DESC')->get();

        return self::informacion($post,true);
    }


    public function getNotice (Request $request) {

        $post_url = $request->get('post_url');

        $post = Post::where('url','=',$post_url)->first();

        $post->category_post;
        
        $post->visits =  $post->visits + 1;

        $post->update();

        return self::informacion($post,true);

    }
  
    public function getOtherNotices (Request $request) {

        $posts = Post::where('id','!=',$request->get('post_id'))->latest()->take(5)->get();

        $others = [
            'posts'      => $posts,
            'categories' => [] 
        ];

        return self::informacion($others,true);

    }

    public function getVirtualTours () {

        $virtual_tours = VirtualTours::all();

        return self::informacion($virtual_tours,true);

    }


    public function getBusiness () {

        $business = Business::find(1);

        $business->logos;

        $business->emails;
        
        $business->social_networks;
        
        $business->phones;
        
        if (isset($business->allies))
            $business->allies;
        
        return self::informacion($business,true);

    }  
  

    public function getEvents (Request $request) {

        $take = $request->get('take');

        $dateInit = Carbon::now()->format('Y-m-d 00:00:00');
        
        if($request->get('all')) {
            $events = Event::with('category')->orderBy('publication_date','desc')->get();
            
            return self::informacion($events,true);
        }

        if ($take != null) { 

            $events = Event::with('category')->where('publication_date','>=',$dateInit)->orderBy('publication_date','asc')->take($take)->get();
        
        } else {

            $events = Event::with('category')->where('publication_date','>=',$dateInit)->orderBy('publication_date','asc')->get();
        }
        
        return self::informacion($events,true);

    }


    public function getEventsByDay ($day) {
        
        $dateStart = Carbon::parse($day)->format('Y-m-d 00:00:00');

        $dateEnd   = Carbon::parse($day)->format('Y-m-d 23:59:59');
        
        $events    = Event::with('event_type','category','sub_category')
            ->whereBetween('publication_date',[$dateStart,$dateEnd])
            //->whereBetween('publication_time_end',[$dateStart,$dateEnd])
        
        /*
        $events = Event::whereDate('publication_date','>',$dateStart)
                        ->whereDate('publication_date_end','<',$dateEnd)
        */
        ->get();

        return self::informacion($events,true);
    }   
   
  
    public function getEventDetail (Request $request) {

        $event_url = $request->get('event_url');

        $event = Event::where('url_detail','=',$event_url)->first();

        if (isset($event)) {

            $event->visits =  $event->visits + 1;

            $event->update();

            $event->event_type;
        
        } else {
            $event = null;
        }

        return self::informacion($event,true);

    }


    public function getIsLive () {

        $event = Event::orderBy('publication_date','desc')->where('isLive','=',true)->first();

        return self::informacion($event,true);
    }
    

    public function getBlog (Request $request) {

        $take = $request->get('take');

        if ($take != null) { 

            $blog = Blog::orderBy('publication_date','desc')->take($take)->get();
        
        } else {

            $blog = Blog::orderBy('publication_date','desc')->get();
        }

        return self::informacion($blog,true);

    }


    public function getBlogDetail (Request $request) {

        $blog_url = $request->get('blog_url');

        $blog = Blog::where('url','=',$blog_url)->first();

        if (isset($blog)) {

            $blog->visits =  $blog->visits + 1;

            $blog->update();
        
        } else {
            $blog = null;
        }

        return self::informacion($blog,true);

    }

    public function getOtherBlogs (Request $request) {

        $blogs = Blog::where('id','!=',$request->get('blog_id'))->latest()->take(5)->get();

        return self::informacion($blogs,true);

    }

    public function formContactSend (Request $request) {

        try {

            DB::beginTransaction();

                $email = $request->get('email');

                $form = FormContact::where('email','=',$email)->first();

                if(isset($form))
                    return self::personalizado('Este correo ya se encuentra registrado.',false);
                
                $data  = $request->all();
                
                FormContact::create($data);

            DB::commit();
            
           	return self::personalizado("Enviado correctamente.",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }
    }



    public function sendComment (Request $request) {

        try {

            DB::beginTransaction();

                $data = $request->all();

                $data['date'] = Carbon::now();

                Comment::create($data);

            DB::commit();
            
           	return self::personalizado("Comentario enviado correctamente.",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }

    public function getComments ( $model, $ip, $item_id ) {

        $comments = Comment::where('status','=',true)
                    ->where('model','=',$model)
                    ->where('item_id','=',$item_id)
                    ->orderBy('date')
                    ->get();

        /** comentarios pendientes de aprobación */
        $myComments = Comment::where('status','=',false)
        ->where('model','=',$model)
        ->where('IP','=',$ip)
        ->where('item_id','=',$item_id)
        ->orderBy('date')
        ->get();

        
        foreach ($myComments as $value) {
            
            $comments->push($value);
        }   

        return self::informacion($comments,true);

    }      
    
    public function getEventById ($event_id) { 

        $event = Event::find($event_id);

        $event->event_type;
        
        return self::informacion($event,true);
    }  

    public function getEventsSchedule () { 
        
        $events = Event::all()->groupBy(function ($item) {
            return Carbon::parse($item['publication_date'])->month;
        });

        $data = collect();

        foreach ($events as $events_by_month) {
            $tmp = $events_by_month->groupBy(function ($item) {
                return Carbon::parse($item['publication_date'])->day;
            });
            $data->push($tmp);
        }

        $newData = collect();
        $otherdata =collect();

        foreach ($data as $events) {
            foreach ($events as $event) {
                
                $startDate = Carbon::parse($event[0]->publication_date)->format('Y-m-d 00:00');     
                
                $endDate   = Carbon::parse($event[0]->publication_date)->format('Y-m-d 23:59');

                if(count($event) > 0) {
                    $tmp = [];
                    $tmp['id']  = $event[0]->id;  
                    $tmp['startTime'] = $startDate;
                    $tmp['endTime'] = $endDate;
                    $tmp['title'] = 'evento ';  
                    $tmp['backgroundColor'] = "#0041C4";     
                    $tmp['allDay'] = false; 

                    $newData->push($tmp);
                }
                $event->total =$event->count();
                $otherdata->push($event);
            }
        }

        $data = [
            'events'    => $newData,
            'other' => $otherdata
        ];   

        return self::informacion($data,true);

        $data = [
            'events'    => $eventsCollect
        ];

        return self::informacion($data,true);
    } 


    public function getSubcategories ($category_id) {

        $category = Category::find($category_id);

        return self::informacion($category->sub_category,true);
    } 


    /** social  metatags*/

    public function getViewMetatags ($section,$url) {

        $events;
        
        $scope = [];

        if ($section == 'eventos') {

            $event = Event::where('url_detail','=',$url)->first();

            if (isset($event)) {

                $scope = [  
                    'title' => $event->title,
                    'og_image' =>'https://piuraculturaviva.com/admin/api/storage/app/'.$event->background_image,
                    'og_title' => $event->title,
                    'og_description' => $event->description,
                    "redirect" => $event->url_detail,
                    "section"  => $section
                ];
            }
        }

        if($section == 'noticias') {

            $event = Post::where('url','=',$url)->first();

            if (isset($event)) {

                $scope = [  
                    'title' => $event->title,
                    'og_image' =>'https://piuraculturaviva.com/admin/api/storage/app/'.$event->background_image,
                    'og_title' => $event->title,
                    'og_description' => $event->subtitle,
                    "redirect" => $event->url,
                    "section"  => $section
                ];
            }
        }

        return view('social',compact('scope'));

    }
}
  