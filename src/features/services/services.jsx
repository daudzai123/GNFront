// // Dependencies: axios, bootstrap

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function ServiceTable() {
//   const [services, setServices] = useState([]);
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 5;

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get('http://localhost:8081/document/all');
//       setServices(res.data);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this service?')) return;
//     try {
//       await axios.delete(`http://localhost:8081/document/delete/${id}`);
//       fetchServices();
//     } catch (error) {
//       console.error('Error deleting service:', error);
//     }
//   };

//   const handleEdit = (service) => {
//     alert('Edit form will show here. Implement as needed.');
//   };

//   const filteredServices = services.filter(s =>
//     s.title.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredServices.length / recordsPerPage);
//   const startIndex = (currentPage - 1) * recordsPerPage;
//   const currentRecords = filteredServices.slice(startIndex, startIndex + recordsPerPage);

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">📄 خدمات</h3>
//         <input
//           type="text"
//           placeholder="🔍 Search by title..."
//           className="form-control w-25 shadow-sm rounded-pill"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive rounded shadow-sm">
//         <table className="table table-hover table-bordered align-middle">
//           <thead className="table-light">
//             <tr className="text-center">
//               <th>ای ډی</th>
//               <th>نام</th>
//               <th>IP آدرس</th>
//               <th>URL</th>
//               <th>تاریخ</th>
//               <th>وزارت</th>
//               <th>کارمند</th>
//               <th>عمل</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRecords.map((service, idx) => (
//               <tr key={service.service_id || idx} className="text-center">
//                 <td>{startIndex + idx + 1}</td>
//                 <td>{service.title}</td>
//                 <td>{service.ip_address}</td>
//                 <td>{service.url}</td>
//                 <td>{service.createdAT}</td>
//                 <td>{service.ministry_id}</td>
//                 <td>{service.user_id}</td>
//                 <td>
//                   <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(service)}>
//                     ✏️ Edit
//                   </button>
//                   <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(service.service_id)}>
//                     🗑️ Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="d-flex justify-content-center mt-4">
//         <ul className="pagination">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
//               <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
//                 {i + 1}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// export default function ServiceTable() {
//    const { t } = useTranslation();
//   const [services, setServices] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editService, setEditService] = useState(null);

//   // Edit states
//   const [editTitle, setEditTitle] = useState("");
//   const [editIp, setEditIp] = useState("");
//   const [editUrl, setEditUrl] = useState("");
//   const [editDate, setEditDate] = useState("");
//   const [editMinistryId, setEditMinistryId] = useState("");
//   const [editUserId, setEditUserId] = useState("");

//   const recordsPerPage = 5;

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get("http://localhost:8081/document/all");
//       setServices(res.data);
//     } catch (error) {
//       console.error("Error fetching services:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this service?"))
//       return;
//     try {
//       await axios.delete(`http://localhost:8081/document/delete/${id}`);
//       fetchServices();
//     } catch (error) {
//       console.error("Error deleting service:", error);
//     }
//   };

//   const handleEdit = (service) => {
//     setEditService(service);
//     setEditTitle(service.title);
//     setEditIp(service.ip_address);
//     setEditUrl(service.url);
//     setEditDate(service.createdAT);
//     setEditMinistryId(service.ministry_id);
//     setEditUserId(service.user_id);
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(
//         `http://localhost:8081/document/update/${editService.service_id}`,
//         {
//           ...editService,
//           title: editTitle,
//           ip_address: editIp,
//           url: editUrl,
//           createdAT: editDate,
//           ministry_id: editMinistryId,
//           user_id: editUserId,
//         }
//       );
//       setEditService(null);
//       fetchServices();
//     } catch (error) {
//       console.error("Error updating service:", error);
//     }
//   };

//   const filteredServices = services.filter((s) =>
//     s.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredServices.length / recordsPerPage);
//   const startIndex = (currentPage - 1) * recordsPerPage;
//   const currentRecords = filteredServices.slice(
//     startIndex,
//     startIndex + recordsPerPage
//   );

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">📄 {t('service.service')}</h3>
//         <input
//           type="text"
//           placeholder={t('service.search')}
//           className="form-control w-25 shadow-sm rounded-pill"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive rounded shadow-sm">
//         <table className="table table-hover table-bordered align-middle">
//           <thead className="table-light">
//             <tr className="text-center">
//               <th> {t('service.id')}</th>
//               <th>{t('service.name')}</th>
//               <th>{t('service.ip')}</th>
//              <th>{t('service.user')}</th>
//               <th>{t('service.action')}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRecords.map((service, idx) => (
//               <tr key={service.service_id || idx} className="text-center">
//                 <td>{startIndex + idx + 1}</td>
//                 <td>{service.title}</td>
//                 <td>{service.ip_address}</td>
//                 <td>{service.url}</td>
//                 <td>{service.createdAT}</td>
//                 <td>{service.ministry_id}</td>
//                 <td>{service.user_id}</td>
//                 <td>
//                   <button
//                     className="btn btn-sm btn-outline-primary me-2"
//                     onClick={() => handleEdit(service)}
//                   >
//                     ✏️ Edit
//                   </button>
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() => handleDelete(service.service_id)}
//                   >
//                     🗑️ Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="d-flex justify-content-center mt-4">
//         <ul className="pagination">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <li
//               key={i}
//               className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(i + 1)}
//               >
//                 {i + 1}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Edit Form */}
//       {editService && (
//         <div className="card mt-5 p-4 shadow-sm">
//           <h5 className="mb-3">✏️ د خدمت اصلاح</h5>
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label>{t('service.id')}</label>
//               <input
//                 className="form-control"
//                 value={editService.service_id}
//                 disabled
//               />
//             </div>
//             <div className="col-md-6">
//               <label>{t('service.name')}</label>
//               <input
//                 className="form-control"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//               />
//             </div>
//             <div className="col-md-6">
//               <label>{t('service.ip')}</label>
//               <input
//                 className="form-control"
//                 value={editIp}
//                 onChange={(e) => setEditIp(e.target.value)}
//               />
//             </div>
//             <div className="col-md-6">
//               <label>{t('service.url')}</label>
//               <input
//                 className="form-control"
//                 value={editUrl}
//                 onChange={(e) => setEditUrl(e.target.value)}
//               />
//             </div>
//             <div className="col-md-6">
//               <label>{t('service/date')}</label>
//               <input
//                 className="form-control"
//                 value={editDate}
//                 onChange={(e) => setEditDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-6">
//               <label>{t('service/ministry')}</label>
//               <input
//                 className="form-control"
//                 value={editMinistryId}
//                 onChange={(e) => setEditMinistryId(e.target.value)}
//               />
//             </div>
//             <div className="col-md-6">
//               <label>{t('service.user')}</label>
            
//               <input
//                 className="form-control"
//                 value={editUserId}
//                 onChange={(e) => setEditUserId(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="mt-4">
//             <button className="btn btn-success me-2" onClick={handleUpdate}>
//               💾 {t('service.save')}
//             </button>
//             <button
//               className="btn btn-secondary"
//               onClick={() => setEditService(null)}
//             >
//               ❌ {t('service.cancel')}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
 import Swal from 'sweetalert2';
export default function ServiceTable() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editService, setEditService] = useState(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [editServiceIp, setEditServiceIp] = useState("");

  const recordsPerPage = parseInt(import.meta.env.VITE_PAGE_SIZE || 10);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/dep-services`);
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };



const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This service will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/dep-services/${id}`);
      fetchServices();

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The service has been deleted.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error("Error deleting service:", error);

      Swal.fire({
        icon: 'error',
        title: 'Deletion Failed',
        text: 'An error occurred while deleting the service.',
        footer: error.response?.data?.message || error.message
      });
    }
  }
};

  const handleEdit = (service) => {
    setEditService(service);
    setEditServiceName(service.serviceName);
    setEditDepartmentName(service.departmentName);
    setEditServiceIp(service.serviceIp);
  };

  const handleUpdate = async () => {
    try {
       await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/dep-services/${editService.id}`, {
      
        serviceName: editServiceName,
        departmentName: editDepartmentName,
        serviceIp: editServiceIp
      });
      setEditService(null);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const filteredServices = services.filter((s) =>
    s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
    s.departmentName?.toLowerCase().includes(search.toLowerCase()) ||
    s.serviceIp?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredServices.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">📄 {t('service.service')}</h3>
        <input
          type="text"
          placeholder={t('service.search')}
          className="form-control w-25 shadow-sm rounded-pill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th>{t('service.id')}</th>
              <th>{t('service.name')}</th>
              <th>{t('service.department')}</th>
              <th>{t('service.ip')}</th>
              <th>{t('service.action')}</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((service, idx) => (
              <tr key={service.id || idx} className="text-center">
                <td>{startIndex + idx + 1}</td>
                <td>{service.serviceName}</td>
                <td>{service.departmentName}</td>
                <td>{service.serviceIp}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(service)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(service.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {editService && (
        <div className="card mt-5 p-4 shadow-sm">
          <h5 className="mb-3">✏️ {t('service.edit_title')}</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label>{t('service.name')}</label>
              <input
                className="form-control"
                value={editServiceName}
                onChange={(e) => setEditServiceName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label>{t('service.department')}</label>
              <input
                className="form-control"
                value={editDepartmentName}
                onChange={(e) => setEditDepartmentName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label>{t('service.ip')}</label>
              <input
                className="form-control"
                value={editServiceIp}
                onChange={(e) => setEditServiceIp(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <button className="btn btn-success me-2" onClick={handleUpdate}>
              💾 {t('service.save')}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditService(null)}
            >
              ❌ {t('service.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}