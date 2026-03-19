const inspections = [
  {"_id":"698d057bb005105d7bf43ee2","inspectionId":"AI-1770849659663","property":{"_id":"698cffecee08cec00fc69cee","propertyId":"PRP-236310367","name":"test","address":"te"}}
];

const property = "698cffecee08cec00fc69cee";

const list = inspections.filter((inspection) => {
  const propObj = typeof inspection.property === 'object' && inspection.property !== null ? inspection.property : null;
  let propId = propObj ? (propObj._id || propObj.id) : (inspection.property || inspection.propertyId);
  if (propId && typeof propId !== 'string') propId = propId.toString();
  return String(propId).trim() === String(property).trim();
});
console.log("Matched items:", list.length);
