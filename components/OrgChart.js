/* Filename: components/OrgChart.js */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Network, Search, Plus, Edit, Trash2, Save, 
  ArrowLeft, ArrowRight, Users, FolderTree, CheckCircle2, X, Settings, 
  ChevronDown, ChevronLeft, ChevronRight, Maximize2, Minimize2 
} from 'lucide-react';

const OrgChart = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { Button, InputField, SelectField, DataGrid, FilterSection, Toggle, Modal, Badge } = UI;

  // --- INTERNAL: CUSTOM TREE COMPONENT (To handle expansion control) ---
  const CustomTreeNode = ({ node, level, selectedId, onSelect, expandedKeys, onToggle, isRtl }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div className="select-none">
        <div 
          className={`
            flex items-center gap-2 py-1.5 px-2 my-0.5 cursor-pointer rounded-lg transition-all
            ${isSelected ? 'bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-200' : 'hover:bg-slate-100 text-slate-700'}
          `}
          style={{ paddingRight: isRtl ? `${level * 16 + 8}px` : '8px', paddingLeft: isRtl ? '8px' : `${level * 16 + 8}px` }}
          onClick={() => onSelect(node)}
        >
          {hasChildren ? (
            <div 
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
            >
               <div className={`transition-transform duration-200 ${isExpanded ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`}>
                 <ChevronDown size={14} />
               </div>
            </div>
          ) : (
             <div className="w-5 h-5"/>
          )}
          
          <div className="flex items-center gap-2 truncate">
             <span className={`text-slate-400 ${isSelected ? 'text-indigo-500' : ''}`}>
               {isExpanded ? <FolderTree size={14}/> : <FolderTree size={14}/>}
             </span>
             <span className="text-[12px] truncate">{node.label[isRtl ? 'fa' : 'en']}</span>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="overflow-hidden">
            {node.children.map(child => (
              <CustomTreeNode 
                key={child.id} node={child} level={level + 1} 
                selectedId={selectedId} onSelect={onSelect} 
                expandedKeys={expandedKeys} onToggle={onToggle} isRtl={isRtl} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- STATES ---
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'designer'
  
  // Charts List Data
  const [charts, setCharts] = useState([
    { id: 1, code: 'ORG-MAIN', title: 'چارت اصلی ۱۴۰۳', type: 'standard', active: true, startDate: '1403/01/01', endDate: '' },
  ]);

  // Tree Data (Currently Active Chart)
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(new Set(['root']));

  // Chart Metadata Logic
  const [filters, setFilters] = useState({ code: '', title: '' });
  const [activeChart, setActiveChart] = useState(null); 
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartFormData, setChartFormData] = useState({});

  // Designer Logic
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Personnel Assignment Logic
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignData, setAssignData] = useState({ id: null, personId: '', fromDate: '', toDate: '' }); // Added ID for editing

  const mockPersonnel = [
    { id: 101, name: 'علی رضایی' },
    { id: 102, name: 'سارا محمدی' },
    { id: 103, name: 'مهندس اکبری' },
  ];

  // --- HANDLERS (LIST VIEW) ---
  const filteredCharts = useMemo(() => {
    return charts.filter(c => {
       const mCode = filters.code ? c.code.includes(filters.code) : true;
       const mTitle = filters.title ? c.title.includes(filters.title) : true;
       return mCode && mTitle;
    });
  }, [charts, filters]);

  const handleOpenChartModal = (chart = null) => {
    if (chart) {
      setChartFormData({ ...chart });
    } else {
      setChartFormData({ code: '', title: '', type: 'standard', active: true, startDate: '', endDate: '' });
    }
    setIsChartModalOpen(true);
  };

  const handleSaveChartMeta = () => {
    if (chartFormData.id) {
      setCharts(prev => prev.map(c => c.id === chartFormData.id ? chartFormData : c));
    } else {
      setCharts(prev => [...prev, { ...chartFormData, id: Date.now() }]);
    }
    setIsChartModalOpen(false);
  };

  const handleDeleteChart = (ids) => {
    if (confirm(t.confirm_delete.replace('{0}', ids.length))) {
      setCharts(prev => prev.filter(c => !ids.includes(c.id)));
    }
  };

  const handleOpenDesigner = (chart) => {
    setActiveChart(chart);
    // Mock: Load tree data for this chart. For demo, we reset or load static mock.
    if(chart.id === 1 && treeData.length === 0) {
       setTreeData([
          { 
            id: 'root', label: { fa: 'مدیر عامل', en: 'CEO' }, active: true, 
            personnel: [{ id: 101, name: 'علی رضایی', from: '1403/01/01' }],
            children: [
              { id: 'fin', label: { fa: 'معاونت مالی', en: 'Finance VP' }, active: true, children: [], personnel: [] },
              { id: 'hr', label: { fa: 'منابع انسانی', en: 'HR' }, active: true, children: [], personnel: [] }
            ]
          }
       ]);
       setExpandedKeys(new Set(['root']));
    } else if (chart.id !== 1) {
       setTreeData([]); // Empty for new charts
    }
    setSelectedNode(null);
    setViewMode('designer');
  };

  // --- HANDLERS (DESIGNER VIEW) ---
  
  // Tree Expansion Control
  const toggleExpand = (id) => {
    const newSet = new Set(expandedKeys);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedKeys(newSet);
  };

  const expandAll = () => {
    const allIds = new Set();
    const traverse = (nodes) => {
      nodes.forEach(n => {
        if (n.children && n.children.length > 0) {
          allIds.add(n.id);
          traverse(n.children);
        }
      });
    };
    traverse(treeData);
    setExpandedKeys(allIds);
  };

  const collapseAll = () => setExpandedKeys(new Set());

  // Node CRUD
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
       // Auto expand parent
       setExpandedKeys(prev => new Set(prev).add(parentId));
    }
  };

  const handleDeleteNode = (nodeId) => {
    if (!confirm(t.oc_delete_confirm_cascade)) return;
    
    const deleteRecursive = (nodes) => {
      return nodes.filter(n => n.id !== nodeId).map(n => ({
        ...n,
        children: n.children ? deleteRecursive(n.children) : []
      }));
    };
    setTreeData(prev => deleteRecursive(prev));
    setSelectedNode(null);
  };

  // Personnel CRUD
  const handleOpenAssignModal = (assignment = null) => {
    if (assignment) {
       // Edit Mode
       setAssignData({ 
          id: assignment.id, 
          personId: mockPersonnel.find(p => p.name === assignment.name)?.id, // Reverse lookup for demo
          fromDate: assignment.fromDate || '', 
          toDate: assignment.toDate || '' 
       });
    } else {
       // Add Mode
       setAssignData({ id: null, personId: '', fromDate: '', toDate: '' });
    }
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!assignData.personId) return;
    const personName = mockPersonnel.find(p => p.id == assignData.personId)?.name;
    
    const updatePersonRecursive = (nodes) => {
      return nodes.map(node => {
        if (node.id === selectedNode.id) {
          let newPersonnelList;
          if (assignData.id) {
             // Update existing
             newPersonnelList = node.personnel.map(p => p.id === assignData.id ? { ...p, name: personName, fromDate: assignData.fromDate, toDate: assignData.toDate } : p);
          } else {
             // Add new
             const newAssignment = { id: Date.now(), name: personName, fromDate: assignData.fromDate, toDate: assignData.toDate };
             newPersonnelList = [...(node.personnel || []), newAssignment];
          }
          return { ...node, personnel: newPersonnelList };
        }
        if (node.children) {
          return { ...node, children: updatePersonRecursive(node.children) };
        }
        return node;
      });
    };
    
    const newTree = updatePersonRecursive(treeData);
    setTreeData(newTree);
    
    // Refresh selected node to show changes immediately
    // Find the updated node in newTree
    const findNode = (nodes, id) => {
       for (let n of nodes) {
          if (n.id === id) return n;
          if (n.children) {
             const found = findNode(n.children, id);
             if (found) return found;
          }
       }
       return null;
    };
    setSelectedNode(findNode(newTree, selectedNode.id));
    setIsAssignModalOpen(false);
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
     const newTree = removeRecursive(treeData);
     setTreeData(newTree);
     
     // Refresh selection
     const findNode = (nodes, id) => {
        for (let n of nodes) {
           if (n.id === id) return n;
           if (n.children) {
              const found = findNode(n.children, id);
              if (found) return found;
           }
        }
        return null;
     };
     setSelectedNode(findNode(newTree, selectedNode.id));
  };

  // --- RENDERS ---

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
               onCreate={() => handleOpenChartModal()}
               actions={(row) => (
                  <div className="flex items-center gap-1">
                     <Button variant="ghost" size="iconSm" icon={FolderTree} title={t.oc_design_btn} className="text-indigo-600 hover:bg-indigo-50" onClick={() => handleOpenDesigner(row)} />
                     <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleOpenChartModal(row)} />
                     <Button variant="ghost" size="iconSm" icon={Trash2} className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteChart([row.id])} />
                  </div>
               )}
            />
         </div>
      </div>
    );
  };

  const renderDesigner = () => {
    // Determine Back Icon based on direction
    const BackIcon = isRtl ? ArrowRight : ArrowLeft;

    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
         {/* 1. Header Actions */}
         <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" icon={BackIcon} onClick={() => setViewMode('list')}>
                  {t.oc_back_list}
               </Button>
               <div className="h-5 w-px bg-slate-300 mx-1"></div>
               <h2 className="font-bold text-slate-800 text-sm">
                  {t.oc_design}: <span className="text-indigo-600">{activeChart?.title}</span>
               </h2>
            </div>
         </div>

         {/* 2. Main Content (Split View) */}
         <div className="flex-1 flex overflow-hidden">
            
            {/* RIGHT (RTL) / LEFT (LTR): Tree Structure */}
            <div className={`w-1/3 min-w-[300px] flex flex-col bg-slate-50/50 ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
               <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-100/50">
                  <h3 className="text-xs font-black text-slate-600 uppercase flex items-center gap-2">
                     <FolderTree size={16}/> {t.oc_tree_title}
                  </h3>
                  <div className="flex items-center gap-1">
                     <Button variant="ghost" size="iconSm" icon={Maximize2} title={t.oc_expand_all} onClick={expandAll} />
                     <Button variant="ghost" size="iconSm" icon={Minimize2} title={t.oc_collapse_all} onClick={collapseAll} />
                     <Button variant="ghost" size="iconSm" icon={Plus} onClick={() => handleAddNode(selectedNode ? selectedNode.id : null)} title={selectedNode ? t.oc_add_child : t.oc_add_root} />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-2">
                  {treeData.length > 0 ? (
                     treeData.map(node => (
                       <CustomTreeNode 
                         key={node.id} node={node} level={0} 
                         selectedId={selectedNode?.id} onSelect={setSelectedNode} 
                         expandedKeys={expandedKeys} onToggle={toggleExpand} isRtl={isRtl} 
                       />
                     ))
                  ) : (
                     <div className="text-center p-8 text-slate-400 text-xs italic">
                        ساختاری تعریف نشده است.
                     </div>
                  )}
               </div>
            </div>

            {/* LEFT (RTL) / RIGHT (LTR): Details */}
            <div className="flex-1 flex flex-col bg-white">
               {selectedNode ? (
                  <>
                     {/* Top Half: Node Info */}
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

                     {/* Bottom Half: Personnel */}
                     <div className="flex-1 flex flex-col p-6 bg-slate-50/30">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-sm font-black text-slate-600 uppercase flex items-center gap-2">
                              <Users size={16}/> {t.oc_personnel}
                           </h3>
                           <Button variant="secondary" size="sm" icon={Plus} onClick={() => handleOpenAssignModal()}>{t.oc_assign_person}</Button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1 relative">
                           {selectedNode.personnel && selectedNode.personnel.length > 0 ? (
                              <div className="absolute inset-0 overflow-auto">
                                 <table className="w-full text-xs">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0">
                                       <tr>
                                          <th className="px-4 py-2 text-right">{t.oc_person}</th>
                                          <th className="px-4 py-2 text-center">{t.oc_from_date}</th>
                                          <th className="px-4 py-2 text-center">{t.oc_to_date}</th>
                                          <th className="px-4 py-2 text-center w-24">{t.colActions}</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                       {selectedNode.personnel.map(p => (
                                          <tr key={p.id} className="hover:bg-slate-50">
                                             <td className="px-4 py-1.5 font-bold text-slate-700">{p.name}</td>
                                             <td className="px-4 py-1.5 text-center dir-ltr text-slate-500">{p.fromDate}</td>
                                             <td className="px-4 py-1.5 text-center dir-ltr text-slate-500">{p.toDate || '-'}</td>
                                             <td className="px-4 py-1.5 text-center">
                                                <div className="flex justify-center gap-1">
                                                   <button onClick={() => handleOpenAssignModal(p)} className="text-indigo-500 hover:bg-indigo-50 p-1 rounded"><Edit size={14}/></button>
                                                   <button onClick={() => handleRemovePerson(p.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
                                                </div>
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

         {/* Chart Meta Modal (Create/Edit Info) */}
         <Modal 
            isOpen={isChartModalOpen} onClose={() => setIsChartModalOpen(false)} 
            title={chartFormData.id ? t.oc_edit : t.oc_new}
            footer={<><Button variant="ghost" onClick={() => setIsChartModalOpen(false)}>{t.btn_cancel}</Button><Button variant="primary" icon={Save} onClick={handleSaveChartMeta}>{t.btn_save}</Button></>}
         >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <InputField label={`${t.oc_code} *`} value={chartFormData.code} onChange={e => setChartFormData({...chartFormData, code: e.target.value})} isRtl={isRtl} className="dir-ltr" />
               <InputField label={`${t.oc_title_field} *`} value={chartFormData.title} onChange={e => setChartFormData({...chartFormData, title: e.target.value})} isRtl={isRtl} />
               <SelectField label={t.oc_type} value={chartFormData.type} onChange={e => setChartFormData({...chartFormData, type: e.target.value})} isRtl={isRtl}>
                  <option value="standard">{t.oc_type_std}</option>
                  <option value="sales">{t.oc_type_sales}</option>
                  <option value="finance">{t.oc_type_finance}</option>
                  <option value="hr">{t.oc_type_hr}</option>
                  <option value="custom">{t.oc_type_custom}</option>
               </SelectField>
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between h-[50px] mt-auto">
                  <span className="text-sm font-bold text-slate-700">{t.active_status}</span>
                  <Toggle checked={chartFormData.active} onChange={v => setChartFormData({...chartFormData, active: v})} />
               </div>
               <InputField label={t.oc_start_date} value={chartFormData.startDate} onChange={e => setChartFormData({...chartFormData, startDate: e.target.value})} isRtl={isRtl} className="dir-ltr" placeholder="1403/01/01"/>
               <InputField label={t.oc_end_date} value={chartFormData.endDate} onChange={e => setChartFormData({...chartFormData, endDate: e.target.value})} isRtl={isRtl} className="dir-ltr" />
            </div>
         </Modal>

         {/* Assign Modal */}
         <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={t.oc_assign_person} size="sm"
            footer={<><Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>{t.btn_cancel}</Button><Button variant="primary" onClick={handleSaveAssignment}>{t.oc_assign}</Button></>}>
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
