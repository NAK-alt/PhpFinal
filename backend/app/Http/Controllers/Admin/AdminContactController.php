<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;

class AdminContactController extends Controller
{
    public function index()
    {
        return response()->json(ContactMessage::latest()->paginate(50));
    }

    public function markRead(ContactMessage $msg)
    {
        $msg->update(['is_read' => true]);
        return response()->json($msg);
    }
}
