/*
 * Copyright (C) 2005-2012 BetaCONCEPT Limited
 *
 * This file is part of Astroboa.
 *
 * Astroboa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Astroboa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Astroboa.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.betaconceptframework.astroboa.model.impl.definition;

import java.io.Serializable;
import java.util.Map;

import javax.xml.namespace.QName;

import org.betaconceptframework.astroboa.api.model.ValueType;
import org.betaconceptframework.astroboa.api.model.definition.CmsDefinition;
import org.betaconceptframework.astroboa.api.model.definition.ComplexCmsPropertyDefinition;
import org.betaconceptframework.astroboa.api.model.definition.Localization;
import org.betaconceptframework.astroboa.api.model.definition.LongPropertyDefinition;
import org.betaconceptframework.astroboa.api.model.exception.CmsException;

/**
 * @author Gregory Chomatas (gchomatas@betaconcept.com)
 * @author Savvas Triantafyllou (striantafyllou@betaconcept.com)
 * 
 */
public final class LongPropertyDefinitionImpl extends SimpleCmsPropertyDefinitionImpl<Long> implements LongPropertyDefinition, Serializable{

	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2804613744337195379L;
	
	private final Long minValue;
	
	private final Long maxValue;
	
	private final boolean minValueExclusive;

	private final boolean maxValueExclusive;

	public LongPropertyDefinitionImpl(QName qualifiedName, Localization description,
			Localization displayName, boolean obsolete, boolean multiple,
			boolean mandatory,Integer order,  String restrictReadToRoles,
			String restrictWriteToRoles, CmsDefinition parentDefinition,
			Long defaultValue, String repositoryObjectRestriction, Map<Long, Localization> valueRange, 
			Long minValue, boolean minValueExclusive, Long maxValue,  boolean maxValueExclusive,boolean representsAnXmlAttribute) {
		
		super(qualifiedName, description, displayName, obsolete, multiple, mandatory,order, 
				restrictReadToRoles, restrictWriteToRoles, parentDefinition,
				defaultValue, repositoryObjectRestriction,valueRange,representsAnXmlAttribute);
		
		this.minValue = minValue; 
		this.maxValue = maxValue; 
		
		this.minValueExclusive = minValueExclusive;
		this.maxValueExclusive = maxValueExclusive; 
		
		//Check if default is within range
		if (defaultValue!=null && !isValueValid(defaultValue)){
			throw new CmsException("Default value "+defaultValue + " is not within value range "+ getValueEnumeration());
		}

	}

	public ValueType getValueType() {
		return ValueType.Long;
	}

	@Override
	public LongPropertyDefinition clone(
			ComplexCmsPropertyDefinition parentDefinition) {
		
		return new LongPropertyDefinitionImpl(getQualifiedName(), cloneDescription(), cloneDisplayName(), isObsolete(), isMultiple(), isMandatory(),
				getOrder(),
				getRestrictReadToRoles(), getRestrictWriteToRoles(), parentDefinition,
				getDefaultValue(), getRepositoryObjectRestriction(), getValueEnumeration(), getMinValue(), minValueExclusive, getMaxValue(), maxValueExclusive,isRepresentsAnXmlAttribute());
	}

	@Override
	public Long getMaxValue() {
		return maxValue;
	}

	@Override
	public Long getMinValue() {
		return minValue;
	}

	@Override
	public boolean isValueValid(Long value) {
		
		if (value == null){
			return false;
		}
		
		boolean valid = true;
		if (getValueEnumeration() != null && ! getValueEnumeration().isEmpty()){
			valid = super.isValueValid(value);
		}
		

		if (valid && minValue != null){
			valid = minValueExclusive? minValue< value :minValue <= value ;
		}
		
		if (valid && maxValue != null){
			valid = maxValueExclusive?  value < maxValue : value <= maxValue ;
		}
		
		return valid ;
	}

	public boolean isMinValueExclusive() {
		return minValueExclusive;
	}

	public boolean isMaxValueExclusive() {
		return maxValueExclusive;
	}
	

}
