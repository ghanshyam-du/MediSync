import React, { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { doctors } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const containerRef = useRef(null);
  let apiRef = useRef(null);

  const startMeeting = (doctor, index) => {
    setCurrentDoctor({ ...doctor, roomName: `appointment-room-${index}` });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen && currentDoctor && containerRef.current) {
      if (!window.JitsiMeetExternalAPI) {
        alert("Jitsi Meet API not loaded");
        return;
      }

      const domain = "meet.jit.si";
      const options = {
        roomName: currentDoctor.roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: 500,
        userInfo: {
          displayName: "Patient Name", // replace with logged-in user
        },
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
      apiRef.current.executeCommand(
        "subject",
        `Consultation with Dr. ${currentDoctor.name}`
      );
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [isModalOpen, currentDoctor]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            {/* Doctor Image */}
            <div>
              <img className="w-32 bg-indigo-50" src={item.image} alt="" />
            </div>

            {/* Doctor Details */}
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.name}</p>
              <p>{item.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.address.line1}</p>
              <p className="text-xs">{item.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                25, July, 2024 | 8:30 PM
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 justify-end">
              <button
                onClick={() => startMeeting(item, index)}
                className="text-sm text-white text-center sm:min-w-48 py-2 border rounded bg-green-600 hover:bg-green-700 transition-all duration-300"
              >
                Join Video Call
              </button>

              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                Pay Online
              </button>
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h2 className="text-lg font-semibold">
                Video Call with Dr. {currentDoctor?.name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>

            {/* Jitsi Container */}
            <div ref={containerRef} className="w-full h-[500px]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
