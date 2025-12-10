
export const User = {
	id: "",
	email: "",
	name: "",
	role: "volunteer", // or 'admin', 'victim'
	phone: "",
	location: {
		latitude: 0,
		longitude: 0,
		address: ""
	},
	organization: "",
	skills: [],
	created_at: ""
};

// Resource type shape (for reference)
// {
//   id: string,
//   title: string,
//   description: string,
//   category: 'food' | 'shelter' | 'medical' | 'transport',
//   quantity: number,
//   available_quantity: number,
//   location: {
//     latitude: number,
//     longitude: number,
//     address: string
//   },
//   provider_id: string,
//   provider_name: string,
//   provider_contact: string,
//   status: 'available' | 'limited' | 'unavailable',
//   requirements?: string,
//   created_at: string,
//   updated_at: string
// }

// Request type shape (for reference)
// {
//   id: string,
//   user_id: string,
//   user_name: string,
//   user_contact: string,
//   resource_id: string,
//   resource_title: string,
//   quantity_requested: number,
//   priority: 'low' | 'medium' | 'high' | 'critical',
//   status: 'pending' | 'approved' | 'allocated' | 'completed' | 'rejected',
//   message?: string,
//   admin_notes?: string,
//   created_at: string,
//   updated_at: string
// }

// Analytics type shape (for reference)
// {
//   total_resources: number,
//   total_requests: number,
//   active_volunteers: number,
//   response_time_avg: number,
//   resources_by_category: {
//     food: number,
//     shelter: number,
//     medical: number,
//     transport: number
//   },
//   requests_by_status: {
//     pending: number,
//     approved: number,
//     allocated: number,
//     completed: number,
//     rejected: number
//   }
// }