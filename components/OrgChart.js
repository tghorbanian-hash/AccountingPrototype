/* Filename: components/OrgChart.js */
import React, { useState, useMemo } from 'react';
import { 
  Network, Search, Plus, Edit, Trash2, Save, 
  ArrowLeft, Users, FolderTree, CheckCircle2, X 
} from 'lucide-react';

const OrgChart = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { Button, InputField, SelectField, DataGrid, FilterSection, Toggle, TreeView, Modal, Badge } = UI;

  // --- States ---
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'designer'
  
  // Charts List Data
  const [charts, setCharts] = useState([
    { id: 1, code: 'ORG-MAIN', title: 'چارت اصلی ۱۴۰۳', type: 'standard', active: true, startDate: '1403/01/01', endDate: '' },
  ]);

  // Tree Data (Mock for currently selected chart)
  const [treeData, setTreeData] = useState([
    { 
      id: 'root', label: { fa: 'مدیر عامل', en: 'CEO' }, active: true, 
      personnel: [{ id: 101, name: 'علی رضایی', from: '1403/01/01' }],
      children: [
        { id: 'fin', label: { fa: 'معاونت مالی', en: 'Finance VP' }, active: true, children: [], personnel: [] },
        { id: 'hr', label: { fa: 'منابع انسانی', en: 'HR' }, active: true, children: [], personnel: [] }
      ]
    }
  ]);

  const [filters, setFilters] = useState({ code: '', title: '' });
  const [activeChart, setActiveChart] = useState(null); // Chart being designed
  
  // Designer States
  const [selectedNode, setSelectedNode] = useState(null);
  const [newNodeName, setNewNodeName] = useState('');
  
  // Personnel Assignment State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignData, setAssignData] = useState({ personId: '', fromDate: '', toDate: '' });

  // Mock Personnel List (LOV)
  const mockPersonnel = [
    { id: 101, name: 'علی رضایی' },
    { id: 102, name: 'سارا محمدی' },
    { id: 103, name: 'مهندس اکبری' },
  ];

  // --- List View Handlers ---
  const filteredCharts = useMemo(() => {
    return charts.filter(c => {
       const mCode = filters.code ? c.code.includes(filters.code) : true;
       const mTitle = filters.title ? c.title.includes(filters.title) : true;
       return mCode && mTitle;
    });
  }, [charts, filters]);

  const handleCreateChart = () => {
    const newChart = { id: Date.now(), code: '', title: '', type: 'standard', active: true, startDate: '', endDate: '' };
    setActiveChart(newChart); // Ideally open a modal first to set basic info, but for now jumping to designer or simple edit
    // For simplicity, let's assume we create and go to designer
    setCharts(prev => [...prev, newChart]);
    setViewMode('designer');
  };

  const handleEditChart = (chart) => {
    setActiveChart(chart);
    setViewMode('designer');
  };

  const handleDeleteChart = (ids) => {
    if (confirm(t.confirm_delete.replace('{0}', ids.length))) {
      setCharts(prev => prev.filter(c => !ids.includes(c.id)));
    }
  };

  // --- Designer Handlers ---
  const handleSaveChartInfo = () => {
    setCharts(prev => prev.map(c => c.id === activeChart.id ? activeChart : c));
    alert(t.defaultsSaved || 'Saved.');
  };

  const handleAddNode = (parentId) => {
    const name = prompt(t.oc_node_title);
    if (!name) return;
    
    const newNode = { id: Date.now().toString(), label: { fa: name, en: name }, active: true, children: [], personnel: [] };
    
    const addNodeRecursive = (nodes) => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return { ...node, children: [...(node.children || []), newNode] };
        }
        if (node.children) {
          return { ...node, children: addNodeRecursive(node.children) };
        }
        return node;
      });
    };

    if (parentId === null) {
       setTreeData(prev => [...prev, newNode]); // Add root
    } else {
       setTreeData(prev => addNodeRecursive(prev));
    }
  };

  const handleDeleteNode = (nodeId) => {
    if (!confirm(t.confirm_delete_single)) return;
    const deleteRecursive = (nodes) => {
      return nodes.filter(n => n.id !== nodeId).map(n => ({
        ...n,
        children: n.children ? deleteRecursive(n.children) : []
      }));
    };
    setTreeData(prev => deleteRecursive(prev));
    setSelectedNode(null);
  };

  const handleAssignPerson = () => {
    if (!assignData.personId) return;
    const personName = mockPersonnel.find(p => p.id == assignData.personId)?.name;
    const newAssignment = { ...assignData, id: Date.now(), name: personName };
    
    // Update tree data with new personnel for selected node
    const updatePersonRecursive = (nodes) => {
      return nodes.map(node => {
        if (node.id === selectedNode.id) {
          return { ...node, personnel: [...(node.personnel || []), newAssignment] };
        }
        if (node.children) {
          return { ...node, children: updatePersonRecursive(node.children) };
        }
        return node;
      });
    };
    
    setTreeData(prev => updatePersonRecursive(prev));
    // Update selected node ref as well to show immediate change
    setSelectedNode(prev => ({ ...prev, personnel: [...(prev.personnel || []), newAssignment] }));
    
    setIsAssignModalOpen(false);
    setAssignData({ personId: '', fromDate: '', toDate: '' });
  };

  const handleRemovePerson = (pId) => {
     if(!confirm(t.confirm_delete_single)) return;
     
     const removeRecursive = (nodes) => {
        return nodes.map(node => {
           if (node.id === selectedNode.id) {
              return { ...node, personnel: node.personnel.filter(p => p.id !== pId) };
           }
           if (node.children) return { ...node, children: removeRecursive(node.children) };
           return node;
        });
     };
     
     setTreeData(prev => removeRecursive(prev));
     setSelectedNode(prev => ({ ...prev, personnel: prev.personnel.filter(p => p.id !== pId) }));
  };

  // --- Renders ---

  const renderList = () => {
    const columns = [
      { field: 'code', header: t.oc_code, width: 'w-24' },
      { field: 'title', header: t.oc_title_field, width: 'w-48' },
      { 
         field: 'type', header: t.oc_type, width: 'w-32',
         render: (row) => {
            const types = { standard: t.oc_type_std, sales: t.oc_type_sales, finance: t.oc_type_finance, hr: t.oc_type_hr, custom: t.oc_type_custom };
            return <Badge variant="neutral">{types[row.type] || row.type}</Badge>
         }
      },
      { field: 'startDate', header: t.oc_start_date, width: 'w-24', className: 'dir-ltr text-center' },
      { field: 'endDate', header: t.oc_end_date, width: 'w-24', className: 'dir-ltr text-center' },
      { 
         field: 'active', header: t.active_status, width: 'w-20',
         render: (row) => <div className="flex justify-center"><Toggle checked={row.active} disabled /></div>
      }
    ];

    return (
      <div className="flex flex-col h-full">
         <FilterSection isRtl={isRtl} onSearch={() => {}} onClear={() => setFilters({ code: '', title: '' })}>
            <InputField label={t.oc_code} value={filters.code} onChange={e => setFilters({...filters, code: e.target.value})} isRtl={isRtl} />
            <InputField label={t.oc_title_field} value={filters.title} onChange={e => setFilters({...filters, title: e.target.value})} isRtl={isRtl} />
         </FilterSection>
         
         <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <DataGrid 
               columns={columns} data={filteredCharts} isRtl={isRtl}
               onCreate={handleCreateChart}
               actions={(row) => (
                  <div className="flex items-center gap-1">
                     <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleEditChart(row)} />
                     <Button variant="ghost" size="iconSm" icon={Trash2} className="text-red-500" onClick={() => handleDeleteChart([row.id])} />
                  </div>
               )}
            />
         </div>
      </div>
    );
  };

  const renderDesigner = () => {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
         {/* Designer Header */}
         <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="iconSm" icon={ArrowLeft} onClick={() => setViewMode('list')} className={isRtl ? 'rotate-180' : ''} />
               <div className="h-6 w-px bg-slate-300 mx-1"></div>
               <h2 className="font-bold text-slate-800">{t.oc_designer_title}: {activeChart.title || '...'}</h2>
            </div>
            <div className="flex gap-2">
               <Button variant="primary" icon={Save} onClick={handleSaveChartInfo}>{t.btn_save}</Button>
            </div>
         </div>

         <div className="flex-1 flex overflow-hidden">
            {/* Left: Chart Info & Tree */}
            <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/30">
               <div className="p-4 border-b border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-500 uppercase">{t.oc_node_info}</h3>
                  <InputField label={t.oc_code} value={activeChart.code} onChange={e => setActiveChart({...activeChart, code: e.target.value})} isRtl={isRtl} className="bg-white" />
                  <InputField label={t.oc_title_field} value={activeChart.title} onChange={e => setActiveChart({...activeChart, title: e.target.value})} isRtl={isRtl} className="bg-white" />
                  <div className="flex gap-2">
                     <InputField label={t.oc_start_date} value={activeChart.startDate} onChange={e => setActiveChart({...activeChart, startDate: e.target.value})} isRtl={isRtl} className="bg-white dir-ltr" />
                     <InputField label={t.oc_end_date} value={activeChart.endDate} onChange={e => setActiveChart({...activeChart, endDate: e.target.value})} isRtl={isRtl} className="bg-white dir-ltr" />
                  </div>
               </div>
               
               <div className="flex-1 flex flex-col p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-xs font-black text-slate-500 uppercase">{t.oc_tree_title}</h3>
                     <Button variant="ghost" size="sm" icon={Plus} onClick={() => handleAddNode(selectedNode ? selectedNode.id : null)}>
                        {selectedNode ? t.oc_add_child : t.oc_add_root}
                     </Button>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg overflow-y-auto p-2">
                     <TreeView 
                        data={treeData} 
                        isRtl={isRtl} 
                        selectedNodeId={selectedNode?.id}
                        onSelectNode={setSelectedNode}
                        searchPlaceholder={t.searchMenu}
                     />
                  </div>
               </div>
            </div>

            {/* Right: Selected Node Details & Personnel */}
            <div className="flex-1 p-6 overflow-y-auto">
               {selectedNode ? (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                     <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                           <FolderTree className="text-indigo-600"/>
                           {selectedNode.label[isRtl ? 'fa' : 'en']}
                        </h2>
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteNode(selectedNode.id)}>{t.oc_delete_node}</Button>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <InputField label={t.oc_node_title} value={selectedNode.label[isRtl ? 'fa' : 'en']} onChange={() => {}} disabled className="bg-slate-50" />
                        <div className="flex items-end pb-2">
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-700">{t.active_status}</span>
                              <Toggle checked={selectedNode.active} onChange={() => {}} disabled />
                           </div>
                        </div>
                     </div>

                     <div className="border-t border-slate-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <Users size={16}/> {t.oc_personnel}
                           </h3>
                           <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsAssignModalOpen(true)}>{t.oc_assign_person}</Button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                           {selectedNode.personnel && selectedNode.personnel.length > 0 ? (
                              <table className="w-full text-xs">
                                 <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                       <th className="px-3 py-2 text-right">{t.oc_person}</th>
                                       <th className="px-3 py-2 text-center">{t.oc_from_date}</th>
                                       <th className="px-3 py-2 text-center w-12">{t.colActions}</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {selectedNode.personnel.map(p => (
                                       <tr key={p.id}>
                                          <td className="px-3 py-2 font-bold">{p.name}</td>
                                          <td className="px-3 py-2 text-center dir-ltr">{p.fromDate}</td>
                                          <td className="px-3 py-2 text-center">
                                             <button onClick={() => handleRemovePerson(p.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={14}/></button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           ) : (
                              <div className="p-6 text-center text-slate-400 text-xs italic">{t.oc_no_person}</div>
                           )}
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300">
                     <Network size={64} strokeWidth={1} />
                     <p className="mt-4 text-sm font-medium">{t.oc_tree_title}...</p>
                  </div>
               )}
            </div>
         </div>

         {/* Assign Modal */}
         <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={t.oc_assign_person} size="sm"
            footer={<><Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>{t.btn_cancel}</Button><Button variant="primary" onClick={handleAssignPerson}>{t.oc_assign}</Button></>}>
            <div className="space-y-4">
               <SelectField label={t.oc_select_person} isRtl={isRtl} value={assignData.personId} onChange={e => setAssignData({...assignData, personId: e.target.value})}>
                  <option value="">-</option>
                  {mockPersonnel.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
               </SelectField>
               <InputField label={t.oc_from_date} value={assignData.fromDate} onChange={e => setAssignData({...assignData, fromDate: e.target.value})} className="dir-ltr" placeholder="1403/01/01"/>
               <InputField label={t.oc_to_date} value={assignData.toDate} onChange={e => setAssignData({...assignData, toDate: e.target.value})} className="dir-ltr" />
            </div>
         </Modal>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-slate-50/50">
      {viewMode === 'list' && (
         <div className="mb-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                  <Network size={24} />
               </div>
               <div>
                  <h1 className="text-xl font-black text-slate-800">{t.oc_title}</h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">{t.oc_subtitle}</p>
               </div>
            </div>
         </div>
      )}
      
      {viewMode === 'list' ? renderList() : renderDesigner()}
    </div>
  );
};

window.OrgChart = OrgChart;
