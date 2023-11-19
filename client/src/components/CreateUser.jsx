import React from "react";

export default function CreateUser() {
    // You can add form handling logic here

    return (
        <div className="create-user">
            <h2 className="text-2xl font-bold mb-4">Create User/Resource</h2>
            <form>
                {/* Add form fields here */}
                <button type="submit" className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}
