import React, { useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { useIntl } from 'react-intl';

const Dropdown = ({ resources, onSelect, selectedResourceId, isValid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const toggleDropdown = () => setIsOpen(!isOpen);
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });

  const selectedResource = resources.find(resource => resource.idresource === selectedResourceId);
  const borderColor = isValid ? 'border-gray-300' : 'border-red-500';

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className={`bg-white p-2 rounded-md w-full flex items-center justify-between border ${borderColor} shadow-sm`} style={{minHeight: '48px'}} type="button">
        {selectedResource ? (
          <div className="flex items-center">
            <img
              src={`http://localhost:5001/uploads/${atob(selectedResource.photo)}`} // Assuming photo is base64 of filename
              alt="Selected"
              className="h-8 w-8 rounded-full mr-2 object-cover" // Adjusted size
            />
            <span className="flex-1 text-left">{selectedResource.name_first} {selectedResource.name_second}</span>
          </div>
        ) : (
          <span className="flex-1 text-left">{t('select')}</span>
        )}
        <MdArrowDropDown className="text-xl" />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-auto">
          <input
            type="text"
            placeholder={t('search')}
            className="p-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {resources.filter(resource => resource.name_first.toLowerCase().includes(searchTerm.toLowerCase()) || resource.name_second.toLowerCase().includes(searchTerm.toLowerCase())).map((resource) => {
              const filename = atob(resource.photo);
              const imageUrl = `http://localhost:5001/uploads/${filename}`;
              return (
                <li
                  key={resource.idresource}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSelect(resource.idresource);
                    setIsOpen(false); // Close dropdown after selection
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={resource.name_first + ' ' + resource.name_second}
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                  />
                  {resource.name_first} {resource.name_second}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;