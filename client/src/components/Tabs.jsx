import React, { useState } from "react";

const Tabs = ({ children, onTabChange }) => {
	const [activeTab, setActiveTab] = useState(children[0].props.label);

	const handleClick = (e, newActiveTab) => {
		e.preventDefault();
		setActiveTab(newActiveTab);
		if (onTabChange) {
			onTabChange(newActiveTab); // Notify parent of active tab change
		}
	};

	return (
		<div className="w-full mx-auto tabs">
			<div className="flex border-b border-gray-300">
				{children.map((child) => (
					<button
						key={child.props.label}
						className={`${
							activeTab === child.props.label
								? "border-b-2 font-bold"
								: ""
						} flex-1 text-gray-700 text-[14px] py-1.5 ${child.props.label==="Supporter's Voice" ? 'suppText' : child.props.label==="Opposer's Voice" ? 'oppText' : 'altText'}`}
						onClick={(e) => handleClick(e, child.props.label)}
					>
						{child.props.label}
					</button>
				))}
			</div>
			<div className="pt-4">
				{children.map((child) => {
					if (child.props.label === activeTab) {
						return <div key={child.props.label}>{child.props.children}</div>;
					}
					return null;
				})}
			</div>
		</div>
	);
};

const Tab = ({ label, children }) => {
	return (
		<div label={label} className="hidden">
			{children}
		</div>
	);
};

export { Tabs, Tab };
