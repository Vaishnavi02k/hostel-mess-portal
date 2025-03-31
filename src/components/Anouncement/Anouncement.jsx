import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../firebase-config';

function Anouncement() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const announcementRef = collection(db, "announcements");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const currentDate = new Date();
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = currentDate.toLocaleDateString("en-US", options);
        // console.log(formattedDate);
        await addDoc(announcementRef,
            {
                postdate: formattedDate,
                usersubject: subject,
                usermessage: message,

            }
        )

    }

    return (
        <div class="announcement-body max-w-screen-md mx-auto p-5">
            <div class="text-center mb-16">

                <h3 class="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                    Announcement <span class="text-indigo-600">Form</span>
                </h3>
            </div>

            <form class="w-full" onSubmit={(event) => handleSubmit(event)}>

                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Subject
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="text" placeholder="Subject of Announcement" onChange={(e) => setSubject(e.target.value)} />
                    </div>
                </div>

                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Message
                        </label>
                        <textarea rows="10" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={(e) => setMessage(e.target.value)}>

                        </textarea>
                    </div>
                    <button class="mx-auto shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" type="submit">
                        Announce
                    </button>
                </div>


            </form>
        </div>
    )
}

export default Anouncement


