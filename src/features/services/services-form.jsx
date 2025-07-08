
// import React from 'react';
// import axios from 'axios';
// import { useForm, Controller } from 'react-hook-form';
// import DatePicker from 'react-multi-date-picker';
// import arabic from 'react-date-object/calendars/arabic';
// import arabic_fa from 'react-date-object/locales/arabic_fa';
// import { useTranslation } from "react-i18next";
// const ServiceForm = () => {
//    const { t } = useTranslation();
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     let createdAT = "";
//     if (data.createdAT) {
//       createdAT = data.createdAT.format("YYYY/MM/DD");
//     } else {
//       alert("Invalid Hijri date");
//       return;
//     }

//     const payload = {
//       department_name: data.department_name,
//       service_ip: data.service_ip,
//       service_name:data.url
//     };

//     try {
//       await axios.post('/dep-services', payload);
//       alert('Service created successfully!');
//     } catch (error) {
//       console.error('Error creating service:', error);
//       alert('Something went wrong while creating the service.');
//     }
//   };

//   return (
   
//     <div className="container py-5">
//   <h2 className="text-center mb-4 fw-bold">{t("service.service_Form")}</h2>
  
//   <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 p-md-5 rounded-3 shadow border">
//     <div className="row g-4">
      
//       <div className="col-md-6">
//         <label className="form-label fw-semibold mb-1">{t('service.name')}</label>
//         <Controller
//           name="department_name"
//           control={control}
//           rules={{ required: true }}
//           render={({ field }) => (
//             <input type="text" className={`form-control ${errors.department_name ? "is-invalid" : ""}`} {...field} />
//           )}
//         />
//         {errors.department_name && <div className="text-danger">Title is required</div>}
//       </div>

    

//       <div className="col-md-6">
//         <label className="form-label fw-semibold mb-1">{t('service.ip')}</label>
//         <Controller
//           name="service_ip"
//           control={control}
//           rules={{
//             required: true,
//             pattern: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
//           }}
//           render={({ field }) => (
//             <input type="text" className={`form-control ${errors.service_ip ? "is-invalid" : ""}`} {...field} />
//           )}
//         />
//         {errors.service_ip && <div className="text-danger">Valid IP is required</div>}
//       </div>


//       <div className="col-md-6">
//          <label className="form-label fw-semibold mb-1">{t('service.user')}</label>
//         <Controller
//           name="service_name"
//           control={control}
//           rules={{ required: true }}
//           render={({ field }) => (
//             <input type="text" className={`form-control ${errors.service_name ? "is-invalid" : ""}`} {...field} />
//           )}
//         />
//         {errors.service_name && <div className="text-danger">URL is required</div>}
//       </div>

    

//     </div>

//     <div className="text-end mt-4">
//       <button type="submit" className="btn btn-primary px-4 py-2">{t('service.create')}</button>
//     </div>
//   </form>
// </div>



//   );
// };

// export default ServiceForm;
// import React from 'react';
// import axios from 'axios';
// import { useForm, Controller } from 'react-hook-form';
// import { useTranslation } from "react-i18next";

// const ServiceForm = () => {
//   const { t } = useTranslation();

//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     const payload = {
//       department_name: data.department_name,
//       service_ip: data.service_ip,
//       service_name: data.service_name,
//     };

//   try {
//   const response = await axios.post(
//     `${import.meta.env.VITE_BASE_URL}/api/dep-services`,
//     payload
//   );
//   alert('Service created successfully!');
// } catch (error) {
//   console.error('Error response:', error.response);
//   console.error('Error message:', error.message);
//   alert('Something went wrong while creating the service.');
// }
//   };

//   return (
//     <div className="container py-5">
//       <h2 className="text-center mb-4 fw-bold">{t("service.service_Form")}</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 p-md-5 rounded-3 shadow border">
//         <div className="row g-4">
//           <div className="col-md-6">
//             <label className="form-label fw-semibold mb-1">{t('service.name')}</label>
//             <Controller
//               name="department_name"
//               control={control}
//               rules={{ required: true }}
//               render={({ field }) => (
//                 <input type="text" className={`form-control ${errors.department_name ? "is-invalid" : ""}`} {...field} />
//               )}
//             />
//             {errors.department_name && <div className="text-danger">Title is required</div>}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label fw-semibold mb-1">{t('service.ip')}</label>
//             <Controller
//               name="service_ip"
//               control={control}
//               rules={{
//                 required: true,
//                 pattern: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
//               }}
//               render={({ field }) => (
//                 <input type="text" className={`form-control ${errors.service_ip ? "is-invalid" : ""}`} {...field} />
//               )}
//             />
//             {errors.service_ip && <div className="text-danger">Valid IP is required</div>}
//           </div>

//           <div className="col-md-6">
//             <label className="form-label fw-semibold mb-1">{t('service.user')}</label>
//             <Controller
//               name="service_name"
//               control={control}
//               rules={{ required: true }}
//               render={({ field }) => (
//                 <input type="text" className={`form-control ${errors.service_name ? "is-invalid" : ""}`} {...field} />
//               )}
//             />
//             {errors.service_name && <div className="text-danger">Service name is required</div>}
//           </div>
//         </div>

//         <div className="text-end mt-4">
//           <button type="submit" className="btn btn-primary px-4 py-2">{t('service.create')}</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ServiceForm;
import React from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
const ServiceForm = () => {
  const { t } = useTranslation();

 const {
  handleSubmit,
  control,
  reset,
  formState: { errors },
} = useForm({
  defaultValues: {
    department_name: "",
    service_ip: "",
    service_name: ""
  }
});

  const onSubmit = async (data) => {
    const payload = {
      departmentName: data.department_name,
      serviceIp: data.service_ip,
      serviceName: data.service_name,
    };

    console.log("Payload being sent:", payload); // Debug only

    // try {
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_BASE_URL}/api/dep-services`,
    //     payload
    //   );
    //   alert('Service created successfully!');
    //     reset({
    //   department_name: "",
    //   service_ip: "",
    //   service_name: ""
    // });
    // } catch (error) {
    //   console.error('Error response:', error.response?.data);
    //   console.error('Error message:', error.message);
    //   alert('Something went wrong while creating the service.');
    // }
    try {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/dep-services`,
    payload
  );

  Swal.fire({
    icon: 'success',
    title: 'Service Created',
    text: 'Service created successfully!',
    timer: 2000,
    showConfirmButton: false
  });

  reset({
    department_name: "",
    service_ip: "",
    service_name: ""
  });

} catch (error) {
  console.error('Error response:', error.response?.data);
  console.error('Error message:', error.message);

  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong while creating the service!',
    footer: error.response?.data?.message || error.message
  });
}

  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">{t("service.service_Form")}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 p-md-5 rounded-3 shadow border">
        <div className="row g-4">

          <div className="col-md-6">
            <label className="form-label fw-semibold mb-1">{t('service.name')}</label>
            <Controller
              name="department_name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input type="text" className={`form-control ${errors.department_name ? "is-invalid" : ""}`} {...field} />
              )}
            />
            {errors.department_name && <div className="text-danger">Department name is required</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold mb-1">{t('service.ip')}</label>
            <Controller
              name="service_ip"
              control={control}
              rules={{
                required: true,
                pattern: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
              }}
              render={({ field }) => (
                <input type="text" className={`form-control ${errors.service_ip ? "is-invalid" : ""}`} {...field} />
              )}
            />
            {errors.service_ip && <div className="text-danger">Valid IP address is required</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold mb-1">{t('service.user')}</label>
            <Controller
              name="service_name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input type="text" className={`form-control ${errors.service_name ? "is-invalid" : ""}`} {...field} />
              )}
            />
            {errors.service_name && <div className="text-danger">Service name is required</div>}
          </div>

        </div>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary px-4 py-2">{t('service.create')}</button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;

