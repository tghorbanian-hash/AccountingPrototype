/* Filename: components/OrgChart.js */
import React, { useState, useMemo } from 'react';
import { 
  Network, Search, Plus, Edit, Trash2, Save, 
  ArrowLeft, Users, FolderTree, CheckCircle2, X, Settings 
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

  // Tree Data
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
  const [activeChart, setActiveChart] = useState(null); 
  
  // Designer States
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Personnel Assignment State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignData, setAssignData] = useState({ personId: '', fromDate: '', toDate: '' });

  // Mock Personnel List (LOV)
  const mockPersonnel = [
    { id: 101, name: 'علی رضایی' },
    { id: 102, name: 'سارا محمدی' },
    { id: 103, name: 'مهندس اکبری' },
  ];

  // --- Handlers ---
  const filteredCharts = useMemo(() => {
    return charts.filter(c => {
       const mCode = filters.code ? c.code.includes(filters.code) : true;
       const mTitle = filters.title ? c.title.includes(filters.title) : true;
       return mCode && mTitle;
    });
  }, [charts, filters]);

  const handleCreateChart = () => {
    const newChart = { id: Date.now(), code: '', title: '', type: 'standard', active: true, startDate: '', endDate: '' };
    setActiveChart(newChart);
    setTreeData([]); // New chart empty tree
    setSelectedNode(null);
    setViewMode('designer');
  };

  const handleEditChart = (chart) => {
    setActiveChart(chart);
    setSelectedNode(null);
    // In real app, load tree data for this chart here
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
       setTreeData(prev => [...prev, newNode]); 
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
         {/* 1. Header Actions */}
         <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => setViewMode('list')} className={isRtl ? 'rotate-180' : ''}>
                  {t.oc_back_list}
               </Button>
               <div className="h-5 w-px bg-slate-300 mx-1"></div>
               <h2 className="font-bold text-slate-800 text-sm">{t.oc_designer_title}</h2>
            </div>
            <Button variant="primary" icon={Save} onClick={handleSaveChartInfo}>{t.btn_save}</Button>
         </div>

         {/* 2. Chart Info Strip (Horizontal) */}
         <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
               <div className="lg:col-span-1">
                  <InputField label={t.oc_code} value={activeChart.code} onChange={e => setActiveChart({...activeChart, code: e.target.value})} isRtl={isRtl} className="bg-white h-9" />
               </div>
               <div className="lg:col-span-2">
                  <InputField label={t.oc_title_field} value={activeChart.title} onChange={e => setActiveChart({...activeChart, title: e.target.value})} isRtl={isRtl} className="bg-white h-9" />
               </div>
               <div className="lg:col-span-1">
                  <SelectField label={t.oc_type} value={activeChart.type} onChange={e => setActiveChart({...activeChart, type: e.target.value})} isRtl={isRtl} className="h-9">
                     <option value="standard">{t.oc_type_std}</option>
                     <option value="sales">{t.oc_type_sales}</option>
                     <option value="finance">{t.oc_type_finance}</option>
                     <option value="hr">{t.oc_type_hr}</option>
                     <option value="custom">{t.oc_type_custom}</option>
                  </SelectField>
               </div>
               <div className="lg:col-span-1">
                  <InputField label={t.oc_start_date} value={activeChart.startDate} onChange={e => setActiveChart({...activeChart, startDate: e.target.value})} isRtl={isRtl} className="bg-white dir-ltr h-9" placeholder="1403/01/01"/>
               </div>
               <div className="lg:col-span-1 flex items-center gap-3 pb-2">
                  <Toggle checked={activeChart.active} onChange={v => setActiveChart({...activeChart, active: v})} label={t.active_status} />
               </div>
            </div>
         </div>

         {/* 3. Main Content (Split View) */}
         <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT: Tree Structure */}
            <div className="w-1/3 min-w-[300px] border-r border-slate-200 flex flex-col bg-slate-50/50">
               <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-100/50">
                  <h3 className="text-xs font-black text-slate-600 uppercase flex items-center gap-2">
                     <FolderTree size={16}/> {t.oc_tree_title}
                  </h3>
                  <Button variant="ghost" size="iconSm" icon={Plus} onClick={() => handleAddNode(selectedNode ? selectedNode.id : null)} title={selectedNode ? t.oc_add_child : t.oc_add_root} />
               </div>
               <div className="flex-1 overflow-y-auto p-2">
                  <TreeView 
                     data={treeData} 
                     isRtl={isRtl} 
                     selectedNodeId={selectedNode?.id}
                     onSelectNode={setSelectedNode}
                     searchPlaceholder={t.searchMenu}
                  />
               </div>
            </div>

            {/* RIGHT: Node Details & Personnel */}
            <div className="flex-1 flex flex-col bg-white">
               {selectedNode ? (
                  <>
                     {/* Top Right: Node Info */}
                     <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                              <Settings size={18} className="text-slate-400"/> {t.oc_node_info}
                           </h3>
                           <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteNode(selectedNode.id)}>{t.oc_delete_node}</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <InputField label={t.oc_node_title} value={selectedNode.label[isRtl ? 'fa' : 'en']} onChange={() => {}} disabled className="bg-slate-50" />
                           <div className="flex items-end pb-2">
                              <Toggle checked={selectedNode.active} onChange={() => {}} label={t.active_status} disabled />
                           </div>
                        </div>
                     </div>

                     {/* Bottom Right: Personnel */}
                     <div className="flex-1 flex flex-col p-6 bg-slate-50/30">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-sm font-black text-slate-600 uppercase flex items-center gap-2">
                              <Users size={16}/> {t.oc_personnel}
                           </h3>
                           <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsAssignModalOpen(true)}>{t.oc_assign_person}</Button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1">
                           {selectedNode.personnel && selectedNode.personnel.length > 0 ? (
                              <div className="overflow-auto h-full">
                                 <table className="w-full text-xs">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0">
                                       <tr>
                                          <th className="px-4 py-3 text-right">{t.oc_person}</th>
                                          <th className="px-4 py-3 text-center">{t.oc_from_date}</th>
                                          <th className="px-4 py-3 text-center">{t.oc_to_date}</th>
                                          <th className="px-4 py-3 text-center w-16">{t.colActions}</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                       {selectedNode.personnel.map(p => (
                                          <tr key={p.id} className="hover:bg-slate-50">
                                             <td className="px-4 py-3 font-bold text-slate-700">{p.name}</td>
                                             <td className="px-4 py-3 text-center dir-ltr text-slate-500">{p.fromDate}</td>
                                             <td className="px-4 py-3 text-center dir-ltr text-slate-500">{p.toDate || '-'}</td>
                                             <td className="px-4 py-3 text-center">
                                                <button onClick={() => handleRemovePerson(p.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                   <X size={16}/>
                                                </button>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           ) : (
                              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                 <Users size={40} strokeWidth={1} className="mb-2 opacity-50"/>
                                 <p className="text-sm">{t.oc_no_person}</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/20">
                     <Network size={80} strokeWidth={0.5} />
                     <p className="mt-4 text-sm font-medium">یک گره را از درخت انتخاب کنید...</p>
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
      {viewMode === 'list' ? renderList() : renderDesigner()}
    </div>
  );
};

window.OrgChart = OrgChart;
