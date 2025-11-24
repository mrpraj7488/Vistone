import React from 'react';
import { FileText } from 'lucide-react';

const CannedResponses = ({ onInsert }) => {
  const cannedResponses = [
    {
      category: 'Technical',
      responses: [
        {
          title: 'Download Link Issue',
          text: "I apologize for the inconvenience with the download link. I've regenerated a new download link for your purchase. Please check your email for the updated link. It will be valid for 7 days."
        },
        {
          title: 'Installation Guide',
          text: "Thank you for reaching out. I've attached a detailed installation guide for your product. Please follow the step-by-step instructions, and let me know if you encounter any issues."
        },
        {
          title: 'License Activation',
          text: "To activate your license, please follow these steps:\n1. Go to your account dashboard\n2. Click on 'Licenses'\n3. Enter your purchase code\n4. Click 'Activate'\n\nIf you continue to have issues, please provide your purchase code and I'll assist you further."
        }
      ]
    },
    {
      category: 'Billing',
      responses: [
        {
          title: 'Refund Processing',
          text: "I've initiated your refund request. The refund will be processed within 3-5 business days and will appear in your account within 7-10 business days, depending on your bank."
        },
        {
          title: 'Invoice Request',
          text: "I've generated and attached your invoice for this purchase. Please let me know if you need any modifications to the billing information."
        },
        {
          title: 'Payment Failed',
          text: "It appears your payment didn't go through. This can happen for several reasons:\n- Insufficient funds\n- Card declined by bank\n- Incorrect card details\n\nPlease verify your payment information and try again, or use an alternative payment method."
        }
      ]
    },
    {
      category: 'General',
      responses: [
        {
          title: 'Thank You',
          text: "Thank you for contacting our support team. We appreciate your patience and are here to help with any questions you may have."
        },
        {
          title: 'Follow Up',
          text: "I wanted to follow up on your previous inquiry. Has the issue been resolved? Please let me know if you need any further assistance."
        },
        {
          title: 'More Information Needed',
          text: "Thank you for reaching out. To better assist you, could you please provide:\n- Your order number\n- Screenshots of the issue (if applicable)\n- Steps you've already tried\n\nThis will help me resolve your issue more quickly."
        },
        {
          title: 'Issue Resolved',
          text: "Great! I'm glad we could resolve your issue. If you have any other questions or concerns in the future, please don't hesitate to reach out. Have a wonderful day!"
        }
      ]
    }
  ];

  return (
    <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
      <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
        <FileText size={16} className="text-blue-600 dark:text-blue-400" />
        Canned Responses
      </h5>
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {cannedResponses.map((category) => (
          <div key={category.category}>
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {category.category}
            </p>
            <div className="space-y-2">
              {category.responses.map((response, idx) => (
                <button
                  key={idx}
                  onClick={() => onInsert(response)}
                  className="w-full text-left px-3 py-3 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    {response.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {response.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CannedResponses;
